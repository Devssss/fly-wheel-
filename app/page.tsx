'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation } from 'motion/react'
import { sdk } from '@/lib/farcaster'
import { useAccount, useBalance } from 'wagmi'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import { Plus, Disc, History, ShieldCheck, Wallet } from 'lucide-react'

const SEGMENTS = [
  { label: '0.1 ETH', value: 0.1, color: '#0d0e12' },
  { label: '0.5 ETH', value: 0.5, color: '#121318' },
  { label: 'LOST', value: 0, color: '#0d0e12' },
  { label: 'JACKPOT', value: 5.0, color: '#0052FF' },
  { label: '2.0 ETH', value: 2.0, color: '#121318' },
  { label: 'RE-SPIN', value: 'free', color: '#0d0e12' }
]

export default function SpinWheelPage() {
  const { isConnected, address } = useAccount()
  const { data: balance } = useBalance({ address })
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [history, setHistory] = useState([
    { id: 1, address: '0x4a...f21', amount: '+0.50 ETH' },
    { id: 2, address: '0x91...cc4', amount: '+2.00 ETH', highlight: true },
    { id: 3, address: '0xde...90a', amount: '+0.05 ETH' },
    { id: 4, address: '0xbc...112', amount: '+0.10 ETH' }
  ])
  
  const controls = useAnimation()

  useEffect(() => {
    sdk.actions.ready()
  }, [])

  const handleSpin = async () => {
    if (isSpinning) return
    setIsSpinning(true)
    
    // Random spin: multiple full rotations + random offset
    const extraRotations = 5 + Math.floor(Math.random() * 5)
    const randomOffset = Math.random() * 360
    const totalRotation = rotation + (extraRotations * 360) + randomOffset
    
    setRotation(totalRotation)
    
    await controls.start({
      rotate: totalRotation,
      transition: { duration: 4, ease: [0.45, 0, 0.55, 1] }
    })
    
    setIsSpinning(false)
    
    // Add logic here for actual on-chain randomness or simulation result call
    // For demo, we just stop.
  }

  return (
    <div className="min-h-screen bg-[#050608] text-[#e0d8d0] font-sans relative overflow-hidden flex items-center justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#0052FF] opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#0052FF] opacity-[0.03] blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-[1200px] h-[800px] bg-[#050608]/40 backdrop-blur-xl border border-white/10 relative z-10 flex flex-col shadow-2xl rounded-3xl overflow-hidden m-4">
        {/* Top Navigation */}
        <nav className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-[#050608]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0052FF] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-light tracking-[0.2em] uppercase">Base<span className="font-bold">Spin</span></span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#0052FF] font-bold">Network Status</span>
              <span className="text-xs text-green-400">Connected: Base Mainnet</span>
            </div>
            <div className="hidden md:block h-10 w-[1px] bg-white/10"></div>
            
            <div className="flex items-center gap-4">
              {isConnected ? (
                <div className="px-6 py-2 border border-white/20 rounded-full text-xs tracking-widest uppercase bg-white/5 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              ) : (
                <ConnectWallet 
                  className="bg-[#0052FF] hover:bg-[#0052FF]/80 text-white rounded-full px-6 py-2 transition-all"
                  text="Connect" 
                />
              )}
            </div>
          </div>
        </nav>

        {/* Main UI Grid */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar: Stats & History */}
          <aside className="hidden lg:flex w-[320px] border-r border-white/10 p-8 flex-col justify-between">
            <div>
              <h2 className="font-serif italic text-3xl mb-8 flex items-center gap-2">
                The Grand Ledger
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 group hover:border-[#0052FF]/30 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total Pool Value</p>
                  <p className="text-2xl font-serif text-[#0052FF]">142.85 ETH</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/60 border-b border-white/10 pb-2 flex items-center gap-2">
                    <History className="w-3 h-3" /> Recent Beneficiaries
                  </h3>
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-white/40 font-mono">{item.address}</span>
                        <span className={`font-serif text-lg ${item.highlight ? 'text-[#0052FF]' : ''}`}>
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest">Fairness Protocol</span>
                <div className="w-2 h-2 bg-[#0052FF] rounded-full animate-pulse shadow-[0_0_8px_#0052FF]"></div>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed italic">
                All outcomes are determined by on-chain verifiable randomness (Base VRF).
              </p>
            </div>
          </aside>

          {/* Main Stage: The Wheel */}
          <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            
            {/* Wheel Container */}
            <div className="relative w-[300px] md:w-[450px] aspect-square flex items-center justify-center">
              
              {/* Pointer */}
              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20">
                <div className="w-6 h-8 bg-white clip-path-polygon-pointer shadow-[0_10px_20px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0052FF] rounded-full"></div>
              </div>

              {/* The Wheel Body */}
              <motion.div 
                animate={controls}
                className="w-full h-full rounded-full border-[8px] md:border-[12px] border-[#1a1b1e] shadow-[0_0_80px_rgba(0,82,255,0.15)] bg-[#0a0b0e] overflow-hidden relative"
              >
                {/* Wheel Segments (SVG) */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {SEGMENTS.map((seg, i) => {
                    const startAngle = (i * 60)
                    const endAngle = ((i + 1) * 60)
                    const x1 = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180))
                    const y1 = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180))
                    const x2 = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180))
                    const y2 = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180))
                    
                    return (
                      <path 
                        key={i}
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={seg.color}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="0.2"
                      />
                    )
                  })}
                </svg>
                
                {/* Segment Labels */}
                {SEGMENTS.map((seg, i) => (
                  <div 
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                    style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                  >
                    <div 
                      className={`mt-8 text-center font-serif ${seg.value === 5.0 ? 'text-3xl font-bold text-white' : 'text-sm md:text-xl'}`}
                    >
                      {seg.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Center Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 bg-[#1a1b1e] rounded-full flex items-center justify-center z-10 border-4 border-[#050608] shadow-2xl">
                <div className="w-10 h-10 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center bg-[#050608]">
                  <div className="w-4 h-4 md:w-6 md:h-6 bg-[#0052FF] rounded-full blur-[4px]"></div>
                </div>
              </div>
            </div>

            {/* Interaction Zone */}
            <div className="mt-8 md:mt-12 flex flex-col items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Cost per turn</p>
                  <p className="text-2xl font-serif">0.05 ETH</p>
                </div>
                
                <button 
                  onClick={handleSpin}
                  disabled={isSpinning || !isConnected}
                  className="group relative px-12 md:px-16 py-4 md:py-5 bg-[#0052FF] text-white rounded-full font-bold uppercase tracking-[0.2em] text-sm shadow-[0_10px_40px_rgba(0,82,255,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10">
                    {isSpinning ? 'Wheel is in motion...' : 'Spin Now'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>

                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Wallet Balance</p>
                  <p className="text-2xl font-serif">
                    {balance ? `${parseFloat(balance.formatted).toFixed(3)} ${balance.symbol}` : '---'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white/20 tracking-[.3em] font-light text-[10px]">
                <Plus className="w-3 h-3" />
                <span>PRESS SPACE TO ACTIVATE MANUALLY</span>
              </div>
            </div>

            {/* Floating Meta Labels */}
            <div className="absolute bottom-8 right-8 hidden md:flex gap-4 items-center">
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-white/20">System Hash</p>
                <p className="text-[10px] font-mono text-white/40">9f21...a142</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-white/20" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
