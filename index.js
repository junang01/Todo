const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));
const savedWeatherData = JSON.parse(localStorage.getItem("saved-weather"));

const createTodo = (storageData) => {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  //여기까지는 dom으로 DOM Element객체를 생성하기만 했지 HTML에 조립하지는 않은 상태다.
  const newBtn = document.createElement("button");
  // addEventListner는 이벤트를 추가해주는 메서드인데 ('a', ()=>{})a에는 이벤트 실행 조건(click, oninput 등..)이고 그 다음은 실행문(익명 함수)를 작성하면 된다
  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete");
    //클릭시 newLi에 complete라는 class를 생성해준다.
    saveItemsFn();
  });

  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItemsFn();
  });
  //옵셔널 체이닝: 객체 뒤에 ?가 붙으면 undefined이거나 null이면 실행 x
  if (storageData?.complete) {
    newLi.classList.add("complete");
  }

  newSpan.textContent = todoContents;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);
  todoInput.value = " ";
  saveItemsFn();
};

const keyCodeCheck = () => {
  // window.event로 이벤트를 감지하다가 keyCode(키보드에 입력되는 값의 고유 번호)가 enter이면 실행. => 단 공백이면 추가가 안되게 trim()을 사용한다. 블록 스코프이기 때문에 실제 값에 영향 x
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

const deleteAll = () => {
  const liList = document.querySelectorAll("li"); //querySelectorAll 해당하는 태그를 배열로 담아 모두 가져온다.
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

const saveItemsFn = function () {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
      // boolean형으로 클래스에 complete아이디가 있는지 확인후 객체에 저장한다.
    };
    saveItems.push(todoObj);
  }
  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
  //삼항 연산자로 if-else문을 대체한다 성립하면?뒤 문장 실행 아니라면 :문장 실행
};

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherDataActive = ({ location, weather }) => {
  const weatherMainList = [
    "Clear",
    "Clouds",
    "Dizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";
  const locationNameTag = document.querySelector("#location-name-tag");
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url(./images/${weather}.jpg)`;

  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather })
    );
  }
};

const weatherSearch = ({ latitude, longitude }) => {
  const openweatherRes = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b6368342983abe6e9fece941384dead0`
  )
    .then((res) => {
      return res.json(); // 응답 body만 있을 경우 json.parse를 사용해도 되지만 응답 헤더가 있는 경우는 res.json()을 사용해야 된다.
    })
    .then((json) => {
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };

      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.error(err);
    });
  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  //프로토콜://         도메인    /path:도메인이 가진 경로/?파라미터: 웹 페이지 로드할 때 전달할 데이터 &로 구분한다. 백틱 문법에 맞게 data를 넣어주면 된다.
};
//구조 분해 할당을 사용. position을 받는게 아니라 position에서 우리가 사용할 {coords}만 받아온다.
const accessToGeo = function ({ coords }) {
  const { latitude, longitude } = coords;
  //short hand property -> 객체의 key와 value가 일치할 때 변수면 적으면 된다.
  positionObj = {
    latitude,
    longitude,
  };
  weatherSearch(positionObj);
};

const askForlocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log("err");
  });
};
askForlocation();

if (savedWeatherData) {
  weatherDataActive(savedWeatherData);
}

$(document).ready(function () {
  $("#move-counter").hover(
    function () {
      $("#move-counter").addClass("hover");
    },
    function () {
      $("#move-counter").removeClass("hover");
    }
  );
});
