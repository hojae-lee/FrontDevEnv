# 프론트 엔드 개발 환경

## 웹팩

### 배경

문법 수준에서 모듈을 지원하기 시작한 것은 ES2015 ~ 입니다. (import/export 구문)
그 전에는 script를 하나씩 로딩해줘서 사용했음.

```html
<script src="src/math.js"></script>
<script src="src/app.js"></script>
```

위와 같이 사용할시 전역 공간에 노출된다는 문제가 발생함.

### IIFE 방식의 모듈

