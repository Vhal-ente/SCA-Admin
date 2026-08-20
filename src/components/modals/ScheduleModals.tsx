import React, { useState, useEffect, useRef } from "react";
import { X, Video, Link, Calendar, AlertTriangle, FileText, ArrowUpRight, ExternalLink, Users, Layers, RefreshCw, Image as ImageIcon, UploadCloud, BarChart3, Trophy, Clock, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StandardEventModalProps, ManageStreamModalProps } from "@/interfaces/schedule-modal";

// ─── A. POST / CREATE EVENT MODAL ───
export function PostEventModal({ isOpen, onClose, onConfirm }: StandardEventModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) setImagePreview(null);
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-[#07090d]">
          <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00FFC6]" /> Post New Event
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if(onConfirm) onConfirm(); }} className="p-5 space-y-4">
          
          {/* IMAGE UPLOAD CORE PIPELINE AREA */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Game Card Banner Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-28 w-full rounded-xl bg-[#07090d] border border-dashed border-slate-800 hover:border-[#00FFC6]/40 flex flex-col items-center justify-center gap-1 cursor-pointer overflow-hidden transition-all duration-200"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 text-[10px] font-black tracking-widest uppercase gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-[#00FFC6]" />
                    Replace Selected Asset
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 group-hover:border-slate-700 text-slate-400 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 group-hover:text-slate-300 uppercase mt-1">Upload Media Vector</span>
                  <span className="text-[8px] font-bold text-slate-600">PNG, JPG up to 5MB</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Game / Category</label>
              <input type="text" placeholder="e.g. VALORANT" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tournament Tier</label>
              <input type="text" placeholder="e.g. TIER 1 MAJOR" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Event Title</label>
            <input type="text" placeholder="e.g. Regional Grand Finals" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Date</label>
              <input type="text" placeholder="OCT 24" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time Reference</label>
              <input type="text" placeholder="18:00 UTC" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" required />
            </div>
          </div>

          <div className="space-y-1.5 border-t border-slate-900 pt-3">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#00FFC6] flex items-center gap-1">
              <Video className="w-3.5 h-3.5" /> Live Stream Broadcast Link
            </label>
            <div className="relative">
              <input type="url" placeholder="https://youtube.com/live/... or Twitch URL" className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50" />
              <Link className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white text-xs uppercase font-bold tracking-wider h-10">Cancel</Button>
            <Button type="submit" className="bg-[#00FFC6] hover:bg-[#00D9A8] text-[#07090d] text-xs font-black uppercase tracking-widest px-5 h-10 rounded-lg">Publish Lifecycle</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── B. EDIT EVENT MODAL ───
export function EditEventModal({ isOpen, onClose, onConfirm, initialData }: StandardEventModalProps) {
  // Safe extraction fallbacks if initial data is modified
  const currentImage = (initialData as any)?.image || null;
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep state matching dynamic prop changes on initializations
  useEffect(() => {
    setImagePreview(currentImage);
  }, [currentImage, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-[#07090d]">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Modify System Event</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if(onConfirm) onConfirm(); }} className="p-5 space-y-4">
          
          {/* IMAGE UPLOAD EDIT CORE HOOK */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Change Game Banner Artwork</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-28 w-full rounded-xl bg-[#07090d] border border-dashed border-slate-800 hover:border-[#00FFC6]/40 flex flex-col items-center justify-center gap-1 cursor-pointer overflow-hidden transition-all duration-200"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-50 transition-opacity" />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                  <div className="relative z-10 flex flex-col items-center text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800/80 text-[10px] font-black tracking-widest uppercase gap-1">
                    <UploadCloud className="w-3.5 h-3.5 text-[#00FFC6]" />
                    Upload / Change Image Asset
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-800 group-hover:border-slate-700 text-slate-400 group-hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 group-hover:text-slate-300 uppercase mt-1">Assign Graphics Vector</span>
                </>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Event Title</label>
            <input type="text" defaultValue={initialData?.title || ""} className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white focus:outline-none focus:border-[#00FFC6]/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Date</label>
              <input type="text" defaultValue={initialData?.date || ""} className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white focus:outline-none focus:border-[#00FFC6]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Time</label>
              <input type="text" defaultValue={initialData?.time || ""} className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white focus:outline-none focus:border-[#00FFC6]/50" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-[#00FFC6] flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Direct Broadcast Link</label>
            <input type="url" defaultValue={initialData?.streamUrl || "https://youtube.com/watch?v=live_stream_id"} className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white focus:outline-none focus:border-[#00FFC6]/50" />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 text-xs font-bold uppercase tracking-wider h-10">Cancel</Button>
            <Button type="submit" className="bg-[#00FFC6] hover:bg-[#00D9A8] text-[#07090d] text-xs font-black uppercase tracking-widest px-5 h-10 rounded-lg">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── C. DELETE CONFIRMATION MODAL ───
export function DeleteEventModal({ isOpen, onClose, onConfirm }: StandardEventModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-rose-950 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center mx-auto text-rose-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Confirm Purge Action</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Are you sure you want to completely clear this event? This execution data stream cannot be reversed.</p>
        </div>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-400 text-xs font-bold uppercase tracking-wider h-9">Abort</Button>
          <Button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest px-4 h-9 rounded-lg">Confirm Delete</Button>
        </div>
      </div>
    </div>
  );
}

// ─── D. VIEW PERFORMANCE REPORT MODAL ───

export function ViewReportModal({ isOpen, onClose, initialData }: StandardEventModalProps) {
  if (!isOpen) return null;

  // Destructure with smart dynamic fallbacks for clean live data integration
  const title = initialData?.title || "Neon Strike Invitational Finals";
  const mapScore = (initialData as any)?.mapScore || "2 — 0";
  const peakViewers = (initialData as any)?.peakViewers || "34,102";
  const avgDuration = (initialData as any)?.avgDuration || "42.5 Mins";
  const totalWatchTime = (initialData as any)?.totalWatchTime || "24,156 Hrs";
  const channels = (initialData as any)?.channels || "YouTube Gaming / Twitch";
  const streamUrl = initialData?.streamUrl || "https://youtube.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-[#1e293b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-[#07090d]">
          <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00FFC6]" /> Post-Match Performance Ledger
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Integrated Split Layout Engine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* COLUMN 1: STATIC MATCH SUMMARY CARD */}
            <div className="bg-[#07090d] border border-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Trophy className="w-3 h-3 text-amber-500" /> Match Execution Result
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wide block line-clamp-2 leading-snug">
                  {title}
                </span>
              </div>
              
              <div className="my-3">
                <div className="text-3xl font-black text-[#00FFC6] tracking-wider font-mono">
                  {mapScore}
                </div>
                <span className="text-[9px] text-emerald-400/80 uppercase font-black tracking-widest block mt-0.5">
                  ARCHIVED SUCCESSFUL
                </span>
              </div>
            </div>

            {/* COLUMN 2: HISTORICAL PERFORMANCE INDICATORS (THE LOCKED ANALYTICS) */}
            <div className="bg-[#07090d] border border-slate-900 rounded-xl p-4 space-y-3">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 border-b border-slate-900 pb-1.5">
                <BarChart3 className="w-3 h-3 text-[#00FFC6]" /> Verified Stream Metrics
              </span>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users2 className="w-3 h-3 text-slate-500" /> Peak Concurrent (PCV)
                  </span>
                  <span className="text-white font-mono font-bold">{peakViewers}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Avg Retention Frame
                  </span>
                  <span className="text-white font-mono font-bold">{avgDuration}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-900/60 pb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Total Air Volume
                  </span>
                  <span className="text-white font-mono font-bold">{totalWatchTime}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Core Target Platform Data Tag */}
          <div className="bg-[#07090d] border border-slate-900/80 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Syndication Networks</span>
            <span className="text-slate-300 font-bold tracking-wide text-[11px]">{channels}</span>
          </div>

          {/* Archival Interactive Playback Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-900">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Data snapshot locked post-broadcast
            </span>
            <a 
              href={streamUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="w-full sm:w-auto bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider px-5 h-10 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Watch Match Broadcast VOD <ArrowUpRight className="w-3.5 h-3.5 text-[#00FFC6]" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── E. MANAGE STREAM MODAL ───
export function ManageStreamModal({ isOpen, onClose, initialData, onUpdateStream }: ManageStreamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-[#07090d]">
          <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Live Stream Control
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (onUpdateStream) onUpdateStream({});
            onClose();
          }} 
          className="p-5 space-y-5"
        >
          <div className="grid grid-cols-2 gap-3 bg-[#07090d] border border-slate-900 rounded-xl p-3">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Viewership Feed
              </span>
              <div className="text-base font-black text-white font-mono">24,810 <span className="text-[10px] text-rose-500 font-sans tracking-widest">LIVE</span></div>
            </div>
            <div className="space-y-0.5 border-l border-slate-900 pl-3">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-slate-400" /> Stream Health
              </span>
              <div className="text-xs font-black text-[#00FFC6] uppercase tracking-wide pt-0.5">EXCELLENT (1080p60)</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tournament Context Title</label>
              <input 
                type="text" 
                defaultValue={initialData?.title || "Valorant Champions Tour: Regional Semi-Finals"} 
                className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50"
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Matchup Match Subtitle</label>
                <input 
                  type="text" 
                  defaultValue={initialData?.subTitle || "Cloud9 vs. Team Liquid"} 
                  className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50"
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-500" /> Current Game Map / State
                </label>
                <input 
                  type="text" 
                  defaultValue={initialData?.mapInfo || "MAP 3 • BIND"} 
                  className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50"
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5 border-t border-slate-900 pt-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#00FFC6] flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Live Streaming Destination URL
              </label>
              <input 
                type="url" 
                defaultValue={initialData?.streamUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} 
                placeholder="YouTube Live Stream or Twitch Channel URL"
                className="w-full bg-[#07090d] border border-slate-800 rounded-lg h-10 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00FFC6]/50"
                required 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-900">
            <a 
              href={initialData?.streamUrl || "https://youtube.com"} 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-[#00FFC6] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group transition-colors"
            >
              Test Stream Feed <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-[#00FFC6]" />
            </a>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider h-10">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#00FFC6] hover:bg-[#00D9A8] text-[#07090d] text-xs font-black uppercase tracking-widest px-5 h-10 rounded-lg shadow-md shadow-emerald-500/5">
                Update Broadcast Feed
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
