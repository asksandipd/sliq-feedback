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
     const rect = canvasRef.current.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     setStartPoint({ x, y });
     setCurrentDrawing({ x, y, width: 0, height: 0, type: drawingTool, shape: drawingShape });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current || !currentDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = currentX - startPoint.x;
    const height = currentY - startPoint.y;

    setCurrentDrawing({
      ...currentDrawing,
      width: Math.abs(width),
      height: Math.abs(height),
      x: width < 0 ? currentX : startPoint.x,
      y: height < 0 ? currentY : startPoint.y,
    });
    redrawCanvas(); // Redraw with intermediate drawing
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentDrawing) return;
    setIsDrawing(false);
    if (currentDrawing.width > 5 && currentDrawing.height > 5) { // Minimum size threshold
      setDrawings([...drawings, currentDrawing]);
    }
    setCurrentDrawing(null);
    setStartPoint(null);
    redrawCanvas(); // Redraw final state
  };

  const redrawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !snapshotOverlayUrl) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const allDrawings = currentDrawing ? [...drawings, currentDrawing] : drawings;

      allDrawings.forEach(drawing => {
        ctx.globalAlpha = 1; // Reset alpha for subsequent drawings
        if (drawing.type === 'highlight') {
          ctx.strokeStyle = 'hsl(var(--accent))'; // Teal
          ctx.lineWidth = 4;
          ctx.globalAlpha = 0.8; // Make highlight slightly transparent
          if (drawing.shape === 'square') {
            ctx.strokeRect(drawing.x, drawing.y, drawing.width, drawing.height);
          } else { // circle
             ctx.beginPath();
             ctx.ellipse(
               drawing.x + drawing.width / 2,
               drawing.y + drawing.height / 2,
               drawing.width / 2,
               drawing.height / 2,
               0, 0, 2 * Math.PI
             );
             ctx.stroke();
          }
        } else if (drawing.type === 'hide') {
          ctx.fillStyle = 'black';
          ctx.globalAlpha = 1; // Ensure black is fully opaque
           if (drawing.shape === 'square') {
              ctx.fillRect(drawing.x, drawing.y, drawing.width, drawing.height);
           } else { // circle
               ctx.beginPath();
               ctx.ellipse(
                 drawing.x + drawing.width / 2,
                 drawing.y + drawing.height / 2,
                 drawing.width / 2,
                 drawing.height / 2,
                 0, 0, 2 * Math.PI
               );
               ctx.fill();
           }
        }
         ctx.globalAlpha = 1; // Reset alpha
      });
    };
    img.src = snapshotOverlayUrl;
  }, [snapshotOverlayUrl, drawings, currentDrawing]);


  React.useEffect(() => {
    if (snapshotOverlayUrl && canvasRef.current) {
      redrawCanvas();
    }
  }, [snapshotOverlayUrl, redrawCanvas]); // Depend on redrawCanvas

  const finishDrawing = () => {
      const canvas = canvasRef.current;
      if (canvas) {
           const finalDataUrl = canvas.toDataURL('image/png');
           const newSnapshot: Snapshot = {
             id: `snapshot-${Date.now()}`,
             dataUrl: finalDataUrl,
           };
           setSnapshots([...snapshots, newSnapshot]);
      }
      setSnapshotOverlayUrl(null);
      setIsCapturing(false);
      onOpenChange(true); // Reopen slider
      setDrawingTool('none'); // Reset tool
  };

  const cancelDrawing = () => {
      setSnapshotOverlayUrl(null);
      setIsCapturing(false);
      onOpenChange(true); // Reopen slider
      setDrawingTool('none'); // Reset tool
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

  if (snapshotOverlayUrl) {
     return (
       <div data-feedback-ignore="true" className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4">
         <div className="bg-background rounded-lg shadow-xl overflow-hidden max-w-full max-h-full flex flex-col">
           {/* Drawing Toolbar */}
           <div className="p-2 border-b flex items-center justify-center space-x-2 bg-muted">
             <span className="text-sm font-medium mr-4">Drawing Tools:</span>
             <Button
               variant={drawingTool === 'highlight' ? 'default' : 'outline'}
               size="sm"
               onClick={() => setDrawingTool('highlight')}
               className={cn(drawingTool === 'highlight' && 'bg-accent hover:bg-accent/90 text-accent-foreground')}
             >
               <Edit2 className="mr-1 h-4 w-4" /> Highlight
             </Button>
             <Button
                variant={drawingTool === 'hide' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setDrawingTool('hide')}
             >
                <XCircle className="mr-1 h-4 w-4" /> Hide
             </Button>
             <div className="border-l h-6 mx-2"></div>
             <Button
                variant={drawingShape === 'square' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setDrawingShape('square')}
                title="Draw Square"
             >
                <Square className="h-4 w-4" />
             </Button>
              <Button
                variant={drawingShape === 'circle' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setDrawingShape('circle')}
                title="Draw Circle"
             >
                <CircleIcon className="h-4 w-4" />
             </Button>
             <div className="flex-grow"></div>
              <Button variant="outline" size="sm" onClick={() => setDrawings([])}>
                Clear Drawings
              </Button>
             <Button variant="ghost" size="sm" onClick={cancelDrawing} className="text-destructive hover:bg-destructive/10">
               Cancel
             </Button>
             <Button size="sm" onClick={finishDrawing}>
               Done
             </Button>
           </div>
           {/* Canvas */}
           <div className="flex-grow overflow-auto p-2">
             <canvas
               ref={canvasRef}
               onMouseDown={handleMouseDown}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}
               onMouseLeave={handleMouseUp} // Treat leaving canvas as mouse up
               className="cursor-crosshair border border-dashed border-primary"
               style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 150px)', display: 'block' }} // Adjust max height as needed
             />
           </div>
         </div>
       </div>
     );
   }


  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent data-feedback-ignore="true" className="sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Send Feedback</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow overflow-hidden">
             <div className="flex-grow overflow-y-auto pr-6 pl-1 -mr-6"> {/* Scrollable content area */}
                <div className="space-y-4 py-4">
                   {/* Snapshots Grid */}
                   <div className="space-y-2">
                     <Label>Snapshots</Label>
                     <ScrollArea className="h-40 w-full rounded-md border p-2">
                       {snapshots.length === 0 ? (
                         <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                           No snapshots captured yet.
                         </div>
                       ) : (
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
                     <Button type="button" variant="outline" onClick={captureSnapshot} disabled={isCapturing} className="w-full">
                       <Camera className="mr-2 h-4 w-4" /> {isCapturing ? 'Initializing...' : 'Capture Snapshot'}
                     </Button>
                   </div>

                   {/* Description */}
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
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   {/* Options */}
                   <div className="space-y-2">
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
