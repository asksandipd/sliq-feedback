"use client";

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import html2canvas from 'html2canvas';
import { X, Camera, Square, Circle as CircleIcon, Trash2, Edit2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { sendFeedback, type FeedbackData, type SystemInformation, type AccountInformation } from '@/services/feedback-service';
import { cn } from '@/lib/utils';

const feedbackFormSchema = z.object({
  description: z.string().min(1, { message: 'Feedback description is required.' }),
  includeAccountInfo: z.boolean().default(false).optional(),
  includeSystemInfo: z.boolean().default(false).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

type Snapshot = {
  id: string;
  dataUrl: string;
};

type DrawingTool = 'highlight' | 'hide' | 'none';
type DrawingShape = 'square' | 'circle';

interface DrawingRect {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'highlight' | 'hide';
  shape: DrawingShape;
}

export function FeedbackSlider({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [snapshots, setSnapshots] = React.useState<Snapshot[]>([]);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [drawingTool, setDrawingTool] = React.useState<DrawingTool>('none');
  const [drawingShape, setDrawingShape] = React.useState<DrawingShape>('square');
  const [drawings, setDrawings] = React.useState<DrawingRect[]>([]);
  const [currentDrawing, setCurrentDrawing] = React.useState<DrawingRect | null>(null);
  const [startPoint, setStartPoint] = React.useState<{ x: number; y: number } | null>(null);
  const [snapshotOverlayUrl, setSnapshotOverlayUrl] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      description: '',
      includeAccountInfo: true,
      includeSystemInfo: true,
    },
  });

  const captureSnapshot = async () => {
    setIsCapturing(true);
    onOpenChange(false); // Close slider temporarily
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for slider to close

    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        logging: false, // Disable logs unless debugging
        ignoreElements: (element) => element.closest('[data-feedback-ignore="true"]') !== null,
        // Ensure full page is captured even if scrolled
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        scrollX: -window.scrollX, // html2canvas expects negative scroll
        scrollY: -window.scrollY,
      });
      const dataUrl = canvas.toDataURL('image/png');
      setSnapshotOverlayUrl(dataUrl);
      setDrawingTool('highlight'); // Default to highlight
      setDrawings([]); // Reset drawings for new snapshot
      setCurrentDrawing(null);
      setStartPoint(null);

    } catch (error) {
      console.error('Error capturing snapshot:', error);
      toast({
        title: 'Error',
        description: 'Failed to capture snapshot.',
        variant: 'destructive',
      });
      setSnapshotOverlayUrl(null); // Ensure overlay is cleared on error
      onOpenChange(true); // Reopen slider on error
    } finally {
       // No need to call setIsCapturing(false) here, done in finishDrawing or cancelDrawing
       // No need to call onOpenChange(true) here, done in finishDrawing or cancelDrawing
    }
  };


  const deleteSnapshot = (id: string) => {
    setSnapshots(snapshots.filter((snapshot) => snapshot.id !== id));
  };

 const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
     if (drawingTool === 'none' || !canvasRef.current) return;
     setIsDrawing(true);
     const canvas = canvasRef.current;
     const rect = canvas.getBoundingClientRect();
     // Calculate scaling factors based on intrinsic vs displayed size
     const scaleX = canvas.width / rect.width;
     const scaleY = canvas.height / rect.height;
     // Calculate coordinates relative to the canvas element and apply scaling
     const x = (e.clientX - rect.left) * scaleX;
     const y = (e.clientY - rect.top) * scaleY;
     setStartPoint({ x, y });
     // Start the drawing at the click point with zero dimensions (using scaled coords)
     setCurrentDrawing({ x, y, width: 0, height: 0, type: drawingTool, shape: drawingShape });
 };

 const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current || !currentDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Calculate scaling factors
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    // Calculate current coordinates relative to the canvas and scale them
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    // Calculate width and height relative to the scaled starting point
    const width = currentX - startPoint.x;
    const height = currentY - startPoint.y;

    // Update the current drawing's dimensions and position using scaled values
    // Handle cases where the user drags left or up from the start point
    setCurrentDrawing({
      ...currentDrawing,
      width: Math.abs(width),
      height: Math.abs(height),
      x: width < 0 ? currentX : startPoint.x, // Adjust scaled x if dragging left
      y: height < 0 ? currentY : startPoint.y, // Adjust scaled y if dragging up
    });
    redrawCanvas(); // Redraw with intermediate drawing shape using scaled coordinates
 };


  const handleMouseUp = () => {
    if (!isDrawing || !currentDrawing) return;
    setIsDrawing(false);
    // Add the completed drawing to the list if it has a minimum size
    if (currentDrawing.width > 5 && currentDrawing.height > 5) { // Minimum size threshold (in scaled coords)
      setDrawings([...drawings, currentDrawing]);
    }
    // Reset current drawing state
    setCurrentDrawing(null);
    setStartPoint(null);
    redrawCanvas(); // Redraw final state without the intermediate shape
  };

  // Use useCallback to memoize redrawCanvas function
  const redrawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !snapshotOverlayUrl) return;

    const img = new window.Image();
    img.onload = () => {
      // Set canvas *internal* dimensions to match the image's actual resolution
      canvas.width = img.naturalWidth; // Use naturalWidth/Height for original dimensions
      canvas.height = img.naturalHeight;

      // Draw the original snapshot image onto the canvas buffer
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Combine completed drawings and the current drawing (if any)
      const allDrawings = currentDrawing ? [...drawings, currentDrawing] : drawings;

      // Draw each shape using the stored scaled coordinates
      allDrawings.forEach(drawing => {
        ctx.globalAlpha = 1; // Reset alpha for each drawing

        if (drawing.type === 'highlight') {
          ctx.strokeStyle = 'hsl(var(--accent))'; // Teal color from theme
          ctx.lineWidth = Math.max(4, canvas.width * 0.003); // Make line width relative
          ctx.globalAlpha = 0.8; // Make highlight slightly transparent

          if (drawing.shape === 'square') {
            ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height);
          } else { // circle/ellipse
             ctx.beginPath();
             // Draw an ellipse centered within the bounding box
             ctx.ellipse(
               drawing.x + drawing.width / 2,
               drawing.y + drawing.height / 2,
               drawing.width / 2, // radiusX
               drawing.height / 2, // radiusY
               0, // rotation
               0, // startAngle
               2 * Math.PI // endAngle
             );
             ctx.stroke();
          }
        } else if (drawing.type === 'hide') {
          ctx.fillStyle = 'black';
          ctx.globalAlpha = 1; // Ensure black is fully opaque

           if (drawing.shape === 'square') {
              ctx.fillRect(drawing.x, drawing.y, drawing.width, drawing.height);
           } else { // circle/ellipse
               ctx.beginPath();
               // Draw a filled ellipse centered within the bounding box
               ctx.ellipse(
                 drawing.x + drawing.width / 2,
                 drawing.y + drawing.height / 2,
                 drawing.width / 2, // radiusX
                 drawing.height / 2, // radiusY
                 0, // rotation
                 0, // startAngle
                 2 * Math.PI // endAngle
               );
               ctx.fill();
           }
        }
         ctx.globalAlpha = 1; // Reset alpha after drawing each shape
      });
    };
    img.src = snapshotOverlayUrl; // Load the snapshot image
  }, [snapshotOverlayUrl, drawings, currentDrawing]); // Removed drawingShape dependency as it's part of currentDrawing


  React.useEffect(() => {
    // Redraw the canvas whenever the snapshot URL, drawings, or current drawing changes
    if (snapshotOverlayUrl && canvasRef.current) {
      redrawCanvas();
    }
  }, [snapshotOverlayUrl, redrawCanvas]); // Depend on redrawCanvas

  const finishDrawing = () => {
      const canvas = canvasRef.current;
      if (canvas) {
           // Get the final image data URL with drawings applied
           const finalDataUrl = canvas.toDataURL('image/png');
           const newSnapshot: Snapshot = {
             id: `snapshot-${Date.now()}`,
             dataUrl: finalDataUrl,
           };
           setSnapshots([...snapshots, newSnapshot]); // Add annotated snapshot
      }
      // Reset drawing state
      setSnapshotOverlayUrl(null);
      setIsCapturing(false);
      onOpenChange(true); // Reopen slider
      setDrawingTool('none');
      setDrawings([]); // Clear drawings for next capture
  };

  const cancelDrawing = () => {
      // Reset drawing state without saving
      setSnapshotOverlayUrl(null);
      setIsCapturing(false);
      onOpenChange(true); // Reopen slider
      setDrawingTool('none');
      setDrawings([]); // Clear drawings
  };


  const getSystemInfo = (): SystemInformation | null => {
     if (typeof window !== 'undefined') {
       const ua = navigator.userAgent;
       let os = 'Unknown OS';
       if (ua.indexOf('Win') !== -1) os = 'Windows';
       if (ua.indexOf('Mac') !== -1) os = 'MacOS';
       if (ua.indexOf('Linux') !== -1) os = 'Linux';
       if (ua.indexOf('Android') !== -1) os = 'Android';
       if (ua.indexOf('like Mac') !== -1) os = 'iOS'; // iPad or iPhone

       let browser = 'Unknown Browser';
       if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
       if (ua.indexOf('SamsungBrowser') !== -1) browser = 'Samsung Internet';
       if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) browser = 'Opera';
       if (ua.indexOf('Trident') !== -1) browser = 'Internet Explorer'; // RIP
       if (ua.indexOf('Edge') !== -1) browser = 'Edge (Legacy)';
       if (ua.indexOf('Edg') !== -1) browser = 'Edge (Chromium)';
       if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1 && ua.indexOf('SamsungBrowser') === -1) browser = 'Chrome';
       if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Edg') === -1 && ua.indexOf('OPR') === -1 && ua.indexOf('SamsungBrowser') === -1) browser = 'Safari';


       return { os, browser };
     }
     return null;
   };

   // Placeholder - Replace with actual user auth logic
   const getAccountInfo = (): AccountInformation | null => {
     // Example: Fetch from auth context or local storage
     // Ensure this only runs client-side if relying on browser APIs
     if (typeof window !== 'undefined') {
         // Replace with your actual logic to get user ID and email
         const userId = localStorage.getItem('userId') || 'guest-user';
         const email = localStorage.getItem('userEmail') || 'guest@example.com';
         return { userId, email };
     }
     return null;
   };


  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    const feedbackPayload: FeedbackData = {
      description: data.description,
      snapshots: snapshots.map(s => s.dataUrl),
      accountInformation: data.includeAccountInfo ? getAccountInfo() || { userId: 'N/A', email: 'N/A' } : { userId: 'N/A', email: 'N/A' },
      systemInformation: data.includeSystemInfo ? getSystemInfo() || { os: 'N/A', browser: 'N/A' } : { os: 'N/A', browser: 'N/A' },
    };

    try {
      const success = await sendFeedback(feedbackPayload);
      if (success) {
        toast({
          title: 'Feedback Sent',
          description: 'Thank you for your feedback!',
        });
        form.reset();
        setSnapshots([]);
        onOpenChange(false);
      } else {
        throw new Error('Server responded with an error.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: 'Error Sending Feedback',
        description: 'Could not send feedback. Please try again later.',
        variant: 'destructive',
      });
    } finally {
       setIsSubmitting(false);
    }
  }

  // Render the drawing overlay if a snapshot URL is available
  if (snapshotOverlayUrl) {
     return (
       <div data-feedback-ignore="true" className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4">
         <div className="bg-background rounded-lg shadow-xl overflow-hidden max-w-full max-h-full flex flex-col">
           {/* Drawing Toolbar */}
           <div className="p-2 border-b flex items-center justify-center space-x-2 bg-muted">
             <span className="text-sm font-medium mr-4">Drawing Tools:</span>
             {/* Highlight Button */}
             <Button
               variant={drawingTool === 'highlight' ? 'default' : 'outline'}
               size="sm"
               onClick={() => setDrawingTool('highlight')}
               className={cn(drawingTool === 'highlight' && 'bg-accent hover:bg-accent/90 text-accent-foreground')}
             >
               <Edit2 className="mr-1 h-4 w-4" /> Highlight
             </Button>
             {/* Hide Button */}
             <Button
                variant={drawingTool === 'hide' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setDrawingTool('hide')}
             >
                <XCircle className="mr-1 h-4 w-4" /> Hide
             </Button>
             {/* Separator */}
             <div className="border-l h-6 mx-2"></div>
             {/* Square Shape Button */}
             <Button
                variant={drawingShape === 'square' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setDrawingShape('square')}
                title="Draw Square/Rectangle"
             >
                <Square className="h-4 w-4" />
             </Button>
             {/* Circle Shape Button */}
              <Button
                variant={drawingShape === 'circle' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setDrawingShape('circle')}
                title="Draw Circle/Ellipse"
             >
                <CircleIcon className="h-4 w-4" />
             </Button>
             {/* Spacer */}
             <div className="flex-grow"></div>
             {/* Clear Drawings Button */}
              <Button variant="outline" size="sm" onClick={() => { setDrawings([]); redrawCanvas(); }}>
                Clear Drawings
              </Button>
             {/* Cancel Button */}
             <Button variant="ghost" size="sm" onClick={cancelDrawing} className="text-destructive hover:bg-destructive/10">
               Cancel
             </Button>
             {/* Done Button */}
             <Button size="sm" onClick={finishDrawing}>
               Done
             </Button>
           </div>
           {/* Canvas Container */}
           <div className="flex-grow overflow-auto p-2 flex items-center justify-center"> {/* Center canvas */}
             {/* Canvas for drawing */}
             <canvas
               ref={canvasRef}
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp} // End drawing if mouse leaves canvas
               className="cursor-crosshair border border-dashed border-primary block" // Use block display
               // Style to control the displayed size and allow scrolling if needed
               // Use max-width/max-height to constrain within the viewport minus padding/toolbar
               style={{
                 maxWidth: 'calc(100vw - 4rem)', // Account for padding
                 maxHeight: 'calc(100vh - 8rem)', // Account for padding and toolbar height
                 objectFit: 'contain', // Ensure the aspect ratio is maintained
               }}
             />
           </div>
         </div>
       </div>
     );
   }


  // Render the main feedback sheet
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent data-feedback-ignore="true" className="sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Send Feedback</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
             {/* Scrollable area for form content */}
             <div className="flex-grow overflow-y-auto pr-6 pl-1 -mr-6">
                <div className="space-y-4 py-4">
                   {/* Snapshots Section */}
                   <div className="space-y-2">
                     <Label>Snapshots</Label>
                     <ScrollArea className="h-40 w-full rounded-md border p-2">
                       {snapshots.length === 0 ? (
                         <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                           No snapshots captured yet.
                         </div>
                       ) : (
                         // Grid to display captured snapshots
                         <div className="grid grid-cols-2 gap-2">
                           {snapshots.map((snapshot) => (
                             <div key={snapshot.id} className="relative group aspect-video">
                               <Image
                                 src={snapshot.dataUrl}
                                 alt={`Snapshot ${snapshot.id}`}
                                 layout="fill"
                                 objectFit="cover"
                                 className="rounded"
                               />
                               {/* Delete button for each snapshot */}
                               <Button
                                 type="button"
                                 variant="destructive"
                                 size="icon"
                                 className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                 onClick={() => deleteSnapshot(snapshot.id)}
                               >
                                 <Trash2 className="h-3 w-3" />
                                 <span className="sr-only">Delete snapshot</span>
                               </Button>
                             </div>
                           ))}
                         </div>
                       )}
                     </ScrollArea>
                     {/* Button to capture a new snapshot */}
                     <Button type="button" variant="outline" onClick={captureSnapshot} disabled={isCapturing} className="w-full">
                       <Camera className="mr-2 h-4 w-4" /> {isCapturing ? 'Initializing...' : 'Capture Snapshot'}
                     </Button>
                   </div>

                   {/* Feedback Description Textarea */}
                   <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Feedback Description</FormLabel>
                         <FormControl>
                           <Textarea
                             placeholder="Describe the issue or your suggestion..."
                             rows={4}
                             {...field}
                           />
                         </FormControl>
                         <FormMessage /> {/* Display validation errors */}
                       </FormItem>
                     )}
                   />

                   {/* Options Checkboxes */}
                   <div className="space-y-2">
                       {/* Include Account Info Checkbox */}
                       <FormField
                          control={form.control}
                          name="includeAccountInfo"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Include account information (User ID, Email)
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                       {/* Include System Info Checkbox */}
                       <FormField
                         control={form.control}
                         name="includeSystemInfo"
                         render={({ field }) => (
                           <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                             <FormControl>
                               <Checkbox
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                               />
                             </FormControl>
                             <FormLabel className="font-normal">
                               Include system information (OS, Browser)
                             </FormLabel>
                           </FormItem>
                         )}
                       />
                   </div>
                </div>
             </div>

            {/* Sheet Footer with Action Buttons */}
            <SheetFooter className="mt-auto pt-4 border-t">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isSubmitting || isCapturing}>
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
