// 1. requires() 함수로 express 모듈을 가져온다. 웹서버를 생성하는데 사용된다.
// express 모듈에는 웹 서버 기능이 내장되어 있고 그 외에도 다양한 기능을 제공한다.
// 예를들면 라우팅, 미들웨어, 템플릿 엔진, 데이터베이스 연동 등의 기능을 제공한다.
// 웹서버 기능을 해줄 express 모듈 import
const express = require('express'); 

// 2. path 모듈을 가져온다.path 모듈은 파일의 경로를 처리하는데 사용된다.
// path 모듈 import
const path = require('path'); 

// fs 모듈 import : fs 모듈은 파일 처리를 위한 모듈이다.
const fs = require('fs');

// 3. express 객체를 생성하여 app 변수에 저장한다.
// express() 함수는 웹서버를 생성하고 app 변수에 웹서버 객체를 저장한다.
const app = express(); 

// 4. 웹 서버의 포트 번호를 지장한다.
// 서버에서 구동되는 데이터베이스, 웹서버 등은 자신만의 고유한 포트 번호를 가지고 있다.
const port = 3000; 

// 5. 미들웨어 등록
// 5.1. 브라우저에서 form의 데이터를 전송하면 서버에서 JSON 형식으로 
// 데이터를 받을 수 있도록 설정한다.
app.use(express.json());

// 5.2. 브라우저에서 form의 데이터를 전송하면 서버에서 urlencoded 형식으로 
// 데이터를 받을 수 있도록 설정한다. Form 태그에 데이터 입력하고 저장할 때
// method 속성을 post로 설정하면 그 데이터가 메시지 통의 바디에 포함되어 전송된다.
// 그 데이터를 서버에서 편리하게 받기 위해 설정하는 것이다.
app.use(express.urlencoded({ extended: true }));

// userData.json 파일에 저장된 데이터를 읽어서 users 변수에 저장한다.
// require() 함수 : node.js에서 제공하는 함수로 파일을 읽어서 자바스크립트 객체로 변환한다.
// 이 함수는 서버 측에서 실행되는 함수이다. 클라이언트 측에서는 사용할 수 없다.
let users = require('./public/userData.json'); // 유저데이터 읽어옴

// 6. 정적파일(정적자원) 처리
// 6.1. public 폴더를 정적파일을 저장하는 폴더로 설정한다.
// 정적파일은 웹브라우저에서 접근 가능한 파일들을 말한다.
// public 폴더에 있는 html, css, js, image 등의 파일들은 웹브라우저에서 접근할 수 있게 된다.
// __dirname은 현재 실행중인 파일의 디렉토리의 절대 경로를 나타낸다.
app.use(express.static(path.join(__dirname, 'public')));

// 7. 라우팅(페이지 이동) 설정
// 웹브라우저에서 요청한 URL에 따라 적절한 처리를 하기 위해 라우팅을 설정한다.
// '/' : 웹브라우저에서 localhost:3000/으로 요청하면 이 함수가 처리한다.
// '/'는 루트 경로를 나타낸다. 즉, 루트에 있는 index.html 파일을 응답한다.
// req : request 객체 즉, 웹브라우저에서 요청한 정보를 담고 있다.
// res : response 객체 즉, 웹서버에서 웹브라우저로 응답할 정보를 담고 있다.
//      응답할 정보는 일반적으로 html 페이지가 응답으로 전송된다.
app.get('/', (req, res) => {
    //res.send('Hello World!');
    // 7.1. sendFile() 함수로 index.html 파일을 응답한다.
    // 'public' 폴더에 있는 index.html 파일을 응답한다.
    // path.join() 함수 : 여러 개의 문자열을 합쳐서 파일의 경로를 만든다.
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 로그인 페이지(login.html) 요청 처리 메소드(함수)
// 웹브라우저에서 localhost:3000/login으로 요청하면 이 함수가 처리한다.
// /login 경로로 get 방식으로 요청이 오면 login.html 파일을 응답으로 제공한다.
// get 요청은 주로 html 페이지를 요청하는 데 사용된다.
 app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // 전송된 페이지를 응답으로 전송
});

// 1. 브라우저에서 post 방식으로 전송한 데이터를 추출한다.
// req.body는 브라우저에서 전송한 데이터 중에서 메시지 통의 바디에 포함된 데이터를 추출한다.
// req.body.id는 브라우저에서 전송한 id 데이터를 추출한다.
// req.body.pwd는 브라우저에서 전송한 pwd 데이터를 추출한다.
// req.body.id와 같이 추출할 수 있는 것은 위에서 설정한 
// app.use(express.urlencoded({ extended: true })); 때문이다.
// post 방식은 일반적으로 서버의 데이터에 조작을 가할때(추가, 수정, 삭제) 사용된다.
app.post('/login', (req, res) => {
    const id = req.body.id; // id 데이터 추출
    const pwd = req.body.password;   // password 데이터 추출

    // 2. 로그인 처리
    // 2.1 위에서 읽어온 users 데이터를 순회하면서 id와 pwd가 일치하는지 확인한다.
    const user = users.find(user => user.id === id && user.password === pwd);

    if(user) { // id와 pwd가 일치하면
        res.redirect('/'); // 2.2. 로그인 성공 시 메인 페이지로 이동
    } else { // id와 pwd가 일치하지 않으면
        // 2.3. 로그인 실패 메시지를 응답으로 전송한다.
        res.send('<script>alert("아이디 또는 비밀번호가 일치하지 않습니다."); window.history.back();</script>');
    }   
});


// 회원가입 페이지 요청 처리
// 사용자가 회원가입 페이지를 요청하면 회원가입 페이지를 응답으로 전송한다.
// 회원가입 페이지는 register.html 파일이다.
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// 회원 가입 처리
// 사용자가 회원가입 페이지에서 데이터를 입력하고 전송하면
// 서버에서 데이터를 받아서 처리한다.
// 사용자가 입력한 데이터는 req.body에 저장되어 있다.
// req.body.id : 사용자가 입력한 id 데이터
// req.body.password : 사용자가 입력한 password 데이터
app.post('/register', (req, res) => {
    // 사용자가 입력한 데이터 추출
    const id = req.body.id; // id 데이터 추출
    const pwd = req.body.password; // password 데이터 추출

    // 기존 사용자 데이터와 중복되는지 확인
    // 사용자가 입력한 아이디(id)가 기존 사용자 데이터(users)에 있는지 확인한다.
    const isDuplicated = users.find(user => user.id === id);

    // 중복된 아이디라면
    if(isDuplicated){
        res.send('<script>alert("이미 존재하는 아이디입니다."); window.history.back();</script>');
    }else{
        // 사용자 자바스크립트 객체 생성[객체 리터럴 방식]
        const user = { id:id, password: pwd }; // 저장할 유저 객체 한개 생성
        
        // 사용자 데이터를 users 배열에 추가
        users.push(user);
        // 사용자 데이터를 userData.json 파일에 저장
        // stringify() 함수는 자바스크립트 객체를 JSON 문자열로 변환한다.
        // JSON.stringify(users, null, 2) : users 객체를 JSON 문자열로 변환한다.
        // null은 replacer 함수로 사용할 함수를 지정한다. 2는 들여쓰기를 나타낸다.
        fs.writeFileSync('./public/userData.json', JSON.stringify(users, null, 2)); 
        // 회원가입 성공 메시지를 응답으로 전송
        res.send('<script>alert("회원가입 성공"); window.location.href="/login";</script>');
    
    }

    
}); 








// 8. 웹 서버 구동(express() 함수로 생성된 웹서버를 구동한다.
// 웹 서버를 구동하고 서버가 구동되면 콘솔에 메시지를 출력한다.
// 여기서 구동되는 서버는 express() 함수로 생성된 웹서버이다.
// express() 함수로 생성된 웹서버는 node.js의 http 모듈을 내부적으로 사용한다.
// 웹서버는 여기서 설정한 포트 번호(3000)로 요청이 올 경우 요청을 받을 준비를 한다.
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


