# 세상에서 가장 공정한 사다리게임

이 프로젝트는 전통적인 사다리 타기 게임의 불공정성을 기술적으로 해결하고, 시각적으로 매력적인 사용자 경험을 제공하는 웹 애플리케이션입니다. 사용자는 참가자와 결과 항목을 자유롭게 설정하고, 애니메이션을 통해 운명의 길이 결정되는 과정을 지켜볼 수 있습니다.

실행 주소 : https://dev-canvas-pi.vercel.app/

## ✨ 주요 기능

- **동적 참가자 및 결과 설정**: 최소 2명부터 최대 10명까지 참가자 수를 조절하고, 각 참가자에 해당하는 결과 항목을 직접 입력할 수 있습니다.
- **압도적인 복잡도 제어**: 사다리의 가로줄 수를 3개부터 최대 400개까지 슬라이더로 간단하게 조절하여 게임의 무작위성을 극대화할 수 있습니다.
- **완벽한 공정성 확보**: '참가자 섞기'와 '결과 섞기' 옵션을 통해 출발점과 도착점의 유불리 가능성을 원천적으로 차단합니다.
- **매력적인 경로 애니메이션**: 각 참가자의 경로가 SVG와 `requestAnimationFrame`을 통해 부드럽고 생생하게 그려지는 과정을 시각적으로 즐길 수 있습니다.
- **개별 및 전체 결과 확인**: 각 참가자의 결과를 개별적으로 확인할 수도 있고, '전체 결과 보기' 버튼으로 모든 경로를 한 번에 확인할 수도 있습니다.
- **애니메이션 속도 조절**: 1x, 2x, 4x 배속으로 애니메이션 속도를 조절하여 게임을 빠르게 또는 천천히 즐길 수 있습니다.
- **설정 기억**: 마지막으로 플레이한 게임의 참가자, 결과, 복잡도, 섞기 옵션이 브라우저(LocalStorage)에 자동으로 저장되어 다음 실행 시 불러옵니다.
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 모든 기기에서 최적화된 화면을 제공합니다.
- **상세한 도움말**: 사다리 게임의 원리와 이 앱이 왜 '공정한지'에 대한 설명을 인포그래픽과 함께 제공하는 도움말 모달이 포함되어 있습니다.
- **커스텀 파비콘**: 사다리 게임의 아이덴티티를 반영한 SVG 기반의 모던한 파비콘을 제공합니다.

## ⚖️ 세상에서 가장 공정한 이유

### 기존 사다리 게임의 숨겨진 불공정성

흔히 모든 출발점의 확률이 같다고 생각하지만, 전통적인 사다리 게임은 구조적으로 불공정합니다.

-   **출발점의 유불리**: 양쪽 끝에 있는 참가자는 경로가 한쪽으로만 꺾일 수 있어 중앙에 있는 참가자보다 특정 결과에 도달할 확률이 통계적으로 달라집니다. 실제 시뮬레이션 연구에 따르면 특정 번호의 당첨 확률이 다른 번호보다 몇 배나 높게 나타나기도 합니다.
-   **가로줄 개수의 함정**: 가로줄의 개수가 적으면, 특정 경로 패턴이 반복될 확률이 높아져 예측 가능성이 생깁니다. 진정한 무작위성을 확보하려면 매우 많은 수의 가로줄이 필요하지만, 현실적으로는 그리기 어렵습니다.

> 이 내용에 대한 더 자세한 설명은 **[은근한 잡다한 지식 YouTube 채널](https://www.youtube.com/watch?v=BRaNXWYKDuo)** 영상에서 확인할 수 있습니다.

### 이 앱이 공정한 이유

우리 앱은 이러한 구조적 문제를 두 가지 강력한 기능으로 해결합니다.

1.  **압도적인 복잡도 (가로줄 수)**: 일본 교토대학의 연구에 따르면, 사다리 게임은 가로줄의 수가 충분히 많아지면 모든 경로의 확률이 통계적으로 거의 동일해집니다. 저희 앱은 가로줄을 최대 **400개**까지 생성할 수 있게 하여, 사실상 완벽에 가까운 무작위성을 보장합니다.

2.  **완벽한 무작위 셔플**: 설령 특정 경로가 구조적으로 유리하더라도, 게임 시작 시 참가자와 결과의 위치를 무작위로 섞어버리면 그 이점은 완전히 무효화됩니다. '참가자 섞기'와 '결과 섞기' 옵션을 활성화하면, 어떤 번호를 선택하든 모든 플레이어가 완벽하게 동일한 조건에서 게임을 시작하게 됩니다.

## 🛠️ 기술 스택

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **Animation**: SVG, CSS Transitions, `requestAnimationFrame`
-   **Build**: Vite (ESM-based, no-bundle setup)

## 📂 파일 구조

```
/
├── index.html               # 앱의 진입점 HTML
├── index.tsx                # React 앱 마운트
├── App.tsx                  # 메인 애플리케이션 컴포넌트 (상태 관리)
├── types.ts                 # 전역 TypeScript 타입 정의
├── services/
│   ├── ladderService.ts     # 사다리 생성 및 경로 계산 로직
│   ├── storageService.ts    # LocalStorage를 이용한 설정 저장/불러오기 로직
│   └── geminiService.ts     # Gemini AI 연동 서비스
├── components/
│   ├── SetupScreen.tsx      # 게임 설정 화면 UI 컴포넌트
│   ├── LadderGameScreen.tsx # 사다리 게임 진행 화면 UI 컴포넌트
│   ├── HelpModal.tsx        # 도움말 모달 컴포넌트
│   └── Icons.tsx            # SVG 아이콘 컴포넌트
└── public/
    ├── favicon.svg          # 사다리 게임 SVG 파비콘
    └── favicon.ico          # 브라우저 호환성을 위한 ICO 파비콘
```

## 🚀 실행 방법

이 애플리케이션은 별도의 빌드 과정 없이 최신 브라우저에서 바로 실행될 수 있도록 구성되어 있습니다.

1.  프로젝트 파일들을 로컬 컴퓨터에 다운로드합니다.
2.  로컬 웹 서버(예: VS Code의 'Live Server' 확장 프로그램 또는 Vite)를 사용하여 프로젝트를 실행합니다.
   ```bash
   # npm 사용
   npm install
   npm run dev
   
   # 또는 yarn 사용
   yarn
   yarn dev
   ```
3.  브라우저가 자동으로 애플리케이션을 렌더링합니다.

## ⚙️ 핵심 로직 상세

### 사다리 생성 (`ladderService.ts`)

공정한 사다리를 생성하기 위해 다음과 같은 알고리즘을 사용합니다.
1.  설정된 가로줄 수와 세로줄 수에 따라 가능한 모든 가로줄 위치의 풀(pool)을 만듭니다.
2.  Fisher-Yates 알고리즘을 사용하여 이 풀을 무작위로 섞습니다.
3.  섞인 풀을 순회하면서, **같은 높이에 인접한 가로줄이 생기지 않도록** 유효한 위치에만 가로줄을 배치합니다. 이 과정을 통해 특정 구간에 가로줄이 몰리는 현상을 방지하고 균일한 분포를 만듭니다.

### 경로 애니메이션 (`LadderGameScreen.tsx`)

SVG 경로(path)의 `stroke-dasharray`와 `stroke-dashoffset` 속성을 이용하여 '선 그리기' 애니메이션을 구현합니다.

1.  `useEffect`를 사용해 각 경로 SVG 요소가 렌더링된 후, `getTotalLength()` 메서드로 총 길이를 계산합니다.
2.  `stroke-dasharray`와 `stroke-dashoffset`을 모두 경로의 총 길이로 설정하여, 경로가 그려져 있지만 보이지 않는 상태로 만듭니다.
3.  애니메이션이 시작되면, `requestAnimationFrame`을 사용하여 시간에 따라 `stroke-dashoffset` 값을 0으로 점차 줄여나갑니다. 이 과정이 선이 그려지는 것처럼 보이게 합니다.
4.  애니메이션 진행 중 경로의 현재 위치를 추적하여, 화면 밖으로 벗어나지 않도록 자동으로 스크롤을 조절하여 사용자 경험을 향상시킵니다.
