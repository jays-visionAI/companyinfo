# 🚀 Vercel + Firebase 배포 가이드

## 1단계: Firebase Console 설정

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 접속
2. **"프로젝트 추가"** 클릭
3. 프로젝트 이름: `companyinfo`
4. Google Analytics 활성화 → **만들기**

### 2. 웹 앱 추가
1. 프로젝트 생성 후 **"</>" 웹 아이콘** 클릭
2. 앱 닉네임: `companyinfo-web`
3. **Firebase Hosting 설정** 체크
4. **앱 등록** 클릭

### 3. Firebase SDK 복사
등록 후 나오는 **firebaseConfig** 값을 복사:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:..."
};
```

### 4. 서비스 활성화 (필수!)

#### Authentication 활성화
1. **Build → Authentication → Get started**
2. **Email/Password** → 활성화
3. **Google** → 활성화 → 이메일 입력

#### Firestore Database 생성
1. **Build → Firestore Database → Create database**
2. **Start in test mode** 선택
3. 위치 선택 (asia-northeast1 - 서울)

---

## 2단계: Vercel 배포

### 방법 A: Vercel CLI (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod

# 환경 변수 입력 프롬프트에서 Firebase 값 입력
```

### 방법 B: Vercel 대시보드
1. [vercel.com](https://vercel.com) → GitHub 로그인
2. **Import Git Repository** → `jays-visionAI/companyinfo`
3. **Environment Variables** 추가:

| Name | Value |
|------|-------|
| VITE_FIREBASE_API_KEY | (Firebase에서 복사) |
| VITE_FIREBASE_AUTH_DOMAIN | (Firebase에서 복사) |
| VITE_FIREBASE_PROJECT_ID | (Firebase에서 복사) |
| VITE_FIREBASE_STORAGE_BUCKET | (Firebase에서 복사) |
| VITE_FIREBASE_MESSAGING_SENDER_ID | (Firebase에서 복사) |
| VITE_FIREBASE_APP_ID | (Firebase에서 복사) |

4. **Deploy** 클릭

---

## 3단계: Firebase Firestore 보안 규칙

### Firestore 규칙 (Build → Firestore → Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Authentication 설정
- **Sign-in method** → **Email/Password** 활성화
- **새로운 사용자가 등록할 수 있도록** 이메일/비밀번호 활성화

---

## 배포 완료 후

1. Vercel에서 생성된 URL 접속
2. Firebase Authentication으로 회원가입/로그인 테스트
3. Firestore에 데이터가 정상 저장되는지 확인

---

## 문제 해결

### "Firebase: Firebase App named '[DEFAULT]' already exists" 에러
- 이미 초기화된 앱이 있는 경우, `firebase.ts`에서 조건부 초기화 추가

### CORS 에러
- Firebase Storage 사용 시 CORS 설정 필요
- Firebase Console → Storage → Rules에서 권한 설정

### 인증 안 되는 문제
- Firebase Console에서 Authentication 서비스 활성화 확인
- 이메일/비밀번호 제공자 활성화 확인
