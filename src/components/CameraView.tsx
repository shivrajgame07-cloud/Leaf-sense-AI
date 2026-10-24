import { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export default function CameraView({ onCapture, isAnalyzing }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera Access Error:', err);
      setError('Could not access camera. Please ensure camera permissions are granted.');
    }
  }, [facingMode, stream]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 jpeg
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div id="camera-view" className="relative h-full w-full bg-black flex flex-col overflow-hidden">
      {/* Viewport */}
      <div className="relative flex-1 flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center p-6 text-center text-white">
            <Info className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={startCamera}
              className="mt-4 px-4 py-2 bg-emerald-600 rounded-full text-sm font-semibold hover:bg-emerald-500 transition-colors"
            >
              Retry Camera
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-emerald-500/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -ml-1 -mt-1 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mr-1 -mt-1 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -ml-1 -mb-1 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mr-1 -mb-1 rounded-br-lg" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 px-6">
        <button
          onClick={toggleCamera}
          className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
          title="Switch Camera"
        >
          <RefreshCw className="w-6 h-6" />
        </button>

        <button
          onClick={captureFrame}
          disabled={isAnalyzing || !!error}
          className={`group relative p-1 rounded-full border-4 border-white transition-all active:scale-90 ${isAnalyzing ? 'opacity-50' : ''}`}
          title="Analyze Leaf"
        >
          <div className="p-10 bg-white rounded-full">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="capture"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Camera className="w-8 h-8 text-emerald-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isAnalyzing && (
             <motion.div 
               className="absolute inset-0 rounded-full border-4 border-emerald-400"
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ duration: 1.5, repeat: Infinity }}
             />
          )}
        </button>

        <div className="w-[56px]" /> {/* Spacer to center the capture button */}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
