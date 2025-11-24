# 커넥팅더닷츠 프론트엔드 과제

React 19와 TypeScript를 사용한 프로젝트입니다.

## 프로젝트 세팅 및 스토리북 실행 방법

1. Node.js 버전 설정

   ```bash
   nvm use v22.17.0
   ```

2. pnpm 설치 (pnpm이 설치되어 있지 않다면)

   ```bash
   npm i -g pnpm
   ```

3. 의존성 설치

   ```bash
   pnpm install
   ```

4. Storybook 실행
   ```bash
   pnpm run storybook
   ```

## 컴포넌트 문서

- [Select](./src/components/Select/README.md)
- [Modal](./src/components/Modal/README.md)

## 기술 스택

- **Runtime**: Node 22.17.0, pnpm 10.12.1
- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7 with SWC
- **Styling**: Tailwind CSS 4
- **Testing/Docs**: Storybook 10, Vitest

## 프로젝트 구조

```
src/
├── components/
│   ├── Select/          # Select 컴포넌트
│   │   ├── README.md    # Select 문서
│   │   └── ...
│   └── Modal/           # Modal 컴포넌트
│       ├── README.md    # Modal 문서
│       └── ...
├── hooks/               # 커스텀 훅
└── utils/               # 유틸리티 함수
```
