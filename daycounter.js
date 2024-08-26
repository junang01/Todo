const startMessage = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");
const inputTitle = document.querySelector("#d-day-input");
const startButton = document.getElementById("start-button");
const startTitle = document.getElementById("title");
const intervalIdArr = [];
const savedDate = localStorage.getItem("saved-date");
const savedTitle = localStorage.getItem("saved-title");
const weather = JSON.parse(localStorage.getItem("saved-weather"));

if (weather) {
  document.body.style.backgroundImage = `url(./images/${weather.weather}.jpg)`;
}
const dataFormMaker = () => {
  //querySelector 같은 경우 Dom을 이용해 HTML 태그를 가져온다.
  const inputYear = document.querySelector("#target-year-input").value;
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;
  const dateFormat = inputYear + "-" + inputMonth + "-" + inputDate;
  return dateFormat;
};

const startButtonOn = () => {
  if (inputTitle.value && inputTitle.value.trim() !== "") {
    startButton.disabled = false;
    startButton.style.cursor = "pointer";
  } else {
    startButton.disabled = true;
    startButton.style.cursor = "default";
  }
};
const counterMake = (data) => {
  if (data !== savedDate) {
    localStorage.setItem("saved-date", data);
  }
  const messageContainer = document.querySelector("#d-day-message");
  const nowDate = new Date();
  const targetDate = new Date(data).setHours(0, 0, 0, 0); // 한국 시간으로 하면 09시 인데 자정 기준으로 바꾼다.(시간,분,초,밀리초)
  const remaining = (targetDate - nowDate) / 1000; //시간 연산은 항상 밀리초로 반환하기 때문에 /1000을 해야한다.
  //수도코드:인간의 로직으로 작성하는 것
  if (remaining <= 0) {
    //만약 remaining이 0이라면, 타이머가 종료 되었습니다. 출력
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.</h3>";
    startMessage.style.display = "flex";
    container.style.display = "none";
    setClearInterval();
    return;
  } else if (isNaN(remaining)) {
    //NaN은 비교 연산자 적용 x 메서드를 사용해서 해야된다 isNaN()
    //만약, 잘못된 날짜가 들어왔다면, 유효한 시간대가 아닙니다 출력
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다. </h3>";
    startMessage.style.display = "flex";
    container.style.display = "none";
    setClearInterval();
    return;
  }
  /*return을 작성한 이유는 조건문에서 걸린다고 함수가 종료되는 것이 아니라 조건문을 제외한 모든 문장이 실행된다 
  하지만 불필요한 연산을 하면 메모리 소모가 되기 때문에 return을 선언해 함수를 종료시킨다.*/

  const documentObj = {
    days: document.querySelector("#days"),
    hour: document.querySelector("#hours"),
    min: document.querySelector("#min"),
    sec: document.querySelector("#sec"),
  };

  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24),
    remainingHour: Math.floor((remaining / 3600) % 24),
    remainingMin: Math.floor((remaining / 60) % 60),
    remainingSec: Math.floor(remaining % 60),
  };

  const documentArr = ["days", "hours", "min", "sec"];
  const timeKeys = Object.keys(remainingObj);
  let i = 0;
  container.style.display = "flex";
  startMessage.style.display = "none";
  for (let key of documentArr) {
    const remainTime = remainingObj[timeKeys[i]];
    if (remainTime < 10) {
      document.getElementById(key).textContent = `0${remainTime}`;
    } else {
      document.getElementById(key).textContent = remainTime;
    }
    i++;
  }
};
const starter = (dateFormat, titleFormat) => {
  if (!dateFormat) {
    dateFormat = dataFormMaker();
  }
  if (!titleFormat) {
    titleFormat = inputTitle.value;
  }
  if (titleFormat !== savedTitle) {
    localStorage.setItem("saved-title", titleFormat);
  }
  //카운트다운 시작 버튼을 누를 당시에 input 태그에 입력된 데이터를 가져온다.
  container.style.display = "flex";
  startMessage.style.display = "none";
  setClearInterval();
  startTitle.textContent = titleFormat;
  counterMake(dateFormat);
  const intervalId = setInterval(() => {
    counterMake(dateFormat);
  }, 1000);
  intervalIdArr.push(intervalId);
  //setInterval은 지정된 시간 이후에 실행하기 때문에 공백 시간이 있다, 그래서 시행전에 먼저 함수를 실행시키면 공백이 없다.
  //interval함수는 실행시 반환값으로 그 인터벌의 id를 반환해준다.
};

const setClearInterval = () => {
  container.style.display = "none";
  startMessage.style.display = "flex";
  startTitle.textContent = "D-Day";
  for (let i = 0; i < intervalIdArr.length; i++) {
    clearInterval(intervalIdArr[i]);
  }
};

const resetTimer = () => {
  localStorage.removeItem("saved-date");
  localStorage.removeItem("saved-title");
  container.style.display = "none";
  startMessage.style.display = "flex";
  startMessage.innerHTML = "<h3>D-Day를 입력해 주세요.<h3>";
  setClearInterval();
};

if (savedDate) {
  starter(savedDate, savedTitle);
  startTitle.textContent = savedTitle;
} else {
  container.style.display = "none";
  startMessage.innerHTML = "<h3>D-Day를 입력해주세요</h3>";
  startTitle.textContent = "D-Day";
}

const focusmonth = () => {
  const month = document.getElementById("target-month-input").value;
  if (month.length === 2) {
    document.getElementById("target-date-input").focus();
  }
};

const focusyear = () => {
  const year = document.getElementById("target-year-input").value;
  if (year.length === 4) {
    document.getElementById("target-month-input").focus();
  }
};

$(document).ready(function () {
  $("#move-todo").hover(
    function () {
      $("#move-todo").addClass("hover");
    },
    function () {
      $("#move-todo").removeClass("hover");
    }
  );
});
