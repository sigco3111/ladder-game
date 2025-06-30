
import React from 'react';
import { XIcon } from './Icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="help-modal-title" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            사다리 게임, 정말 공정할까요?
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors" aria-label="닫기">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8 text-slate-300">
          
          <section>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">출발점에 따라 확률이 다르다?</h3>
            <p className="mb-4">
              흔히 모든 출발점의 확률이 같다고 생각하지만, 사다리 게임은 구조적으로 특정 경로가 더 자주 나오게 설계되어 있습니다. 특히 양 끝에 있는 세로줄은 불리한 경우가 많습니다.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
              <svg width="100%" height="120" viewBox="0 0 200 120" className="mx-auto" aria-hidden="true">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f472b6" />
                    </marker>
                </defs>
                {/* Vertical lines */}
                <line x1="20" y1="10" x2="20" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="80" y1="10" x2="80" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="120" y1="10" x2="120" y2="110" stroke="#475569" strokeWidth="2" />
                <line x1="180" y1="10" x2="180" y2="110" stroke="#475569" strokeWidth="2" />
                {/* Rungs */}
                <line x1="20" y1="40" x2="80" y2="40" stroke="#475569" strokeWidth="2" />
                <line x1="120" y1="70" x2="180" y2="70" stroke="#475569" strokeWidth="2" />
                {/* Path 1 */}
                <path d="M 20 10 V 40 H 80 V 110" stroke="#f472b6" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
                <text x="20" y="8" fill="#f472b6" fontSize="10" textAnchor="middle">출발 1</text>
                <text x="50" y="35" fill="#f472b6" fontSize="10">100% 이동</text>
                
                 {/* Path 2 */}
                <path d="M 120 10 V 70 H 180 V 110" stroke="#a78bfa" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
                <text x="120" y="8" fill="#a78bfa" fontSize="10" textAnchor="middle">출발 3</text>
              </svg>
              <p className="text-sm mt-2 text-slate-400">1번 줄은 가로줄이 있다면 100% 확률로 2번으로 이동합니다. 가운데 줄은 양쪽으로 갈 가능성이 생깁니다.</p>
            </div>
            <p className="mt-4">
              실제 시뮬레이션 결과, 8명 게임에서 특정 번호의 당첨 확률은 21%에 달한 반면, 다른 번호는 3.33%에 불과했다는 연구 결과도 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">가로줄 개수의 비밀</h3>
            <p className="mb-4">
              내가 그린 경로가 가로줄을 몇 번 통과했는지에 따라 도착하는 위치가 결정됩니다. 
              <span className="text-fuchsia-400 font-semibold">홀수</span>번 통과하면 원래 위치와 다른 곳에, 
              <span className="text-green-400 font-semibold">짝수</span>번 통과하면 원래 위치와 같은 곳(혹은 2칸, 4칸 떨어진 곳)에 도착합니다.
            </p>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1 text-center">
                    <svg width="100%" height="100" viewBox="0 0 100 100" className="mx-auto" aria-hidden="true">
                         <defs>
                            <marker id="arrow-odd" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f9a8d4" />
                            </marker>
                        </defs>
                        <line x1="20" y1="10" x2="20" y2="90" stroke="#475569" strokeWidth="2" />
                        <line x1="80" y1="10" x2="80" y2="90" stroke="#475569" strokeWidth="2" />
                        <line x1="20" y1="50" x2="80" y2="50" stroke="#475569" strokeWidth="2" />
                        <path d="M 20 10 V 50 H 80 V 90" stroke="#f9a8d4" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-odd)" />
                        <text x="50" y="25" fill="#f9a8d4" fontSize="12" textAnchor="middle">홀수번 (1번)</text>
                    </svg>
                    <p className="text-sm text-slate-400 mt-1">다른 곳에 도착</p>
                </div>
                 <div className="flex-1 text-center">
                    <svg width="100%" height="100" viewBox="0 0 100 100" className="mx-auto" aria-hidden="true">
                        <defs>
                            <marker id="arrow-even" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#86efac" />
                            </marker>
                        </defs>
                        <line x1="20" y1="10" x2="20" y2="90" stroke="#475569" strokeWidth="2" />
                        <line x1="80" y1="10" x2="80" y2="90" stroke="#475569" strokeWidth="2" />
                        <line x1="20" y1="40" x2="80" y2="40" stroke="#475569" strokeWidth="2" />
                        <line x1="20" y1="70" x2="80" y2="70" stroke="#475569" strokeWidth="2" />
                        <path d="M 20 10 V 40 H 80 V 70 H 20 V 90" stroke="#86efac" strokeWidth="2.5" fill="none" markerEnd="url(#arrow-even)" />
                        <text x="50" y="25" fill="#86efac" fontSize="12" textAnchor="middle">짝수번 (2번)</text>
                    </svg>
                    <p className="text-sm text-slate-400 mt-1">원래 위치로 복귀</p>
                </div>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-700/50">
            <h3 className="text-xl font-bold text-green-400 mb-3">그래서, 이 앱은 어떻게 공정성을 높였을까요?</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg text-slate-100 mb-1">1. 압도적인 복잡도 (가로줄 수)</h4>
                <p>
                  이론적으로 가로줄이 매우 많아지면 모든 경로의 확률이 거의 같아집니다. 저희 앱에서는 가로줄을 최대 <span className="font-bold text-cyan-400">400개</span>까지 설정할 수 있어, 사실상 거의 완벽한 무작위성을 구현합니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-slate-100 mb-1">2. 참가자와 결과 셔플</h4>
                <p>
                  설령 특정 경로가 유리하다 해도, 참가자와 결과의 위치를 무작위로 섞어버리면 그 이점을 무효화할 수 있습니다. '참가자 섞기'와 '결과 섞기' 옵션을 켜면, 어떤 번호를 선택하든 완전히 공평한 조건에서 게임을 시작하게 됩니다.
                </p>
              </div>
            </div>
          </section>

           <div className="text-center pt-6">
             <p className="text-lg font-bold">이것이 바로 <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">"세상에서 가장 공정한 사다리게임"</span>인 이유입니다!</p>
           </div>
           
           <div className="text-center pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
                도움말 내용 출처: <a href="https://www.youtube.com/watch?v=BRaNXWYKDuo" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">은근한 잡다한 지식 (YouTube)</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
