import { chemicalElementsListToSubarrays } from "./elementListConversion.mjs";
const quizNavbarTitle = document.getElementById("navbar-title");
const quizTitle = document.getElementById("quiz-title");
const chemicalElementsList = document.getElementById("chemical-elements-list");
const elementNameContainer = document.getElementById("element-name-container");
const elementFormulaContainer = document.getElementById("element-formula-container");
const quizInput = document.getElementById("quiz-input");
const skipButton = document.getElementById("quiz-skip-btn");
const replayButton = document.getElementById("quiz-replay-btn");
const quizOptionsMenuReplayButton = document.getElementById("quiz-options-menu-replay-btn");
const submitAnswerButton = document.getElementById("quiz-submit-answer-btn");
const instructionsToggleButton = document.getElementById("quiz-instructions-toggle-btn");
const quizInstructions = document.getElementById("quiz-instructions");
const optionsMenuToggleButton = document.getElementById("options-menu-toggle-btn");
const quizOptionsMenu = document.getElementById("quiz-options-menu");
const randomModeToggle = document.getElementById("quiz-random-mode-checkbox");
const swapFormulaNameButton = document.getElementById("quiz-swap-formula-name-btn");
const definitionImage = document.getElementById("definition-img");

quizNavbarTitle.innerText = document.getElementById("quiz-name")?.innerText;
quizTitle.innerText = document.getElementById("quiz-name-en")?.innerText;
class List {
  constructor(elementsNameFormulaArr) {
    this.elementsNameFormulaArr = elementsNameFormulaArr;
    this.elementIndex = 0;
    this.usedElementIndexes = new Set();
    this.usedElementIndexes.add(this.elementIndex);
  }
  listToNextChemicalElement() {
    if (this.elementIndex < this.elementsNameFormulaArr.length) {
      ++this.elementIndex;
      this.usedElementIndexes.add(this.elementIndex);
    }
  }
  listToRandomChemicalElement() {
    const maxRange = this.elementsNameFormulaArr.length;
    if (this.usedElementIndexes.size === this.elementsNameFormulaArr.length) {
      return null;
    }
    while (true) {
      const randIndex = Math.floor(Math.random() * maxRange);
      if (this.usedElementIndexes.has(randIndex)) {
        continue;
      }
      this.usedElementIndexes.add(randIndex);
      this.elementIndex = randIndex;
      return true;
    }
  }
  getChemicalElementName() {
    const element = this.elementsNameFormulaArr[this.elementIndex];
    return element?.[1];
  }
  getChemicalElementFormula() {
    const element = this.elementsNameFormulaArr[this.elementIndex];
    return element?.[0];
  }
  isListFinished() {
    return this.elementIndex == this.elementsNameFormulaArr.length;
  }
  resetList() {
    this.elementIndex = 0;
    this.usedElementIndexes.clear();
    if (randomModeToggle.checked) {
      this.listToRandomChemicalElement();
      return;
    }
    this.usedElementIndexes.add(this.elementIndex);
  }
  swapFormulaName() {
    this.elementsNameFormulaArr.forEach((element) => {
      const swap = element[0];
      element[0] = element[1];
      element[1] = swap;
    });
  }
  getCurrentDefinitionImage() {
    const element = this.elementsNameFormulaArr[this.elementIndex];
    return element?.[2];
  }
}
const termsDefinitions = [
  [
    "физическая величина, определяющая быстроту изменения скорости тела, то есть первая производная от скорости по времени.",
    "Ускоре́ние",
    "Screenshot_20231108_211648.png",
  ],
  [
    "Вес — это сила, с которой тело действует на опору или подвес.",
    "Вес тела",
    "Screenshot_20231108_212936.png",
  ],
  [
    "Любые два тела во вселенной притягиваются друг к другу с силой пропорционально произведению их массы и обратно пропорционально квадрату расстояния между ними.",
    "Закон всемирного тяготения",
    "Screenshot_20231108_213038.png",
  ],
  [
    "Векторная сумма импульсов тел в замкнутой системе постоянна",
    "Закон сохранения импульса",
    "Screenshot_20231108_213131.png",
  ],
  ["Это произведение массы на скорость.", "Импульс тела", "Screenshot_20231108_213213.png"],
  [
    "Сумма кинетической/потенциальной энергии.",
    "Механическая энергия",
    "Screenshot_20231108_213319.png",
  ],
  [
    "Это количество работы, которая совершается за единицу времени.",
    "Мощность",
    "Screenshot_20231108_213430.png",
  ],
  [
    "Это физическая величина, прямо пропорциональная приложенной к телу силе и пройденному телом пути.",
    "Работа",
    "Screenshot_20231108_213535.png",
  ],
  [
    "Движение при котором тело отбрасывает свою часть тела чтобы изменить свою скорость.",
    "Реактивное движение",
    "",
  ],
  [
    "Сила с которой Земля притягивает все тела. Сила тяжести равна произведению массы и ускорения свободного падения. ",
    "Сила тяжести",
    "Screenshot_20231108_213846.png",
  ],
];
// Creating a chemical elements list
const list = new List(
  quizTitle.innerText === "Physics 12-v"
    ? termsDefinitions
    : chemicalElementsListToSubarrays(chemicalElementsList.innerHTML)
);

// Initializing
init();
function init() {
  list.resetList();
  displayChemicalElementName();
  hideChemicalElementFormula();
  quizInput.disabled = false;
}

function displayChemicalElementName() {
  const elementName = list.getChemicalElementName();
  if (elementName) {
    elementNameContainer.innerText = elementName;
    return;
  }
  elementNameContainer.innerText = "👍";
}
function displayChemicalElementFormula() {
  const chemicalElementFormula = list.getChemicalElementFormula();
  elementFormulaContainer.innerText = chemicalElementFormula ?? "Конец.";
  elementFormulaContainer.classList.toggle("quiz__element-formula-container--hidden");
}
function hideChemicalElementFormula() {
  elementFormulaContainer.classList.add("quiz__element-formula-container--hidden");
}

quizInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
function clearInput() {
  quizInput.value = "";
}
function checkAnswer() {
  const userAnswer = quizInput.value.toLowerCase().trim();
  clearInput();
  const chemicalElementFormula = list.getChemicalElementFormula().toLowerCase();
  if (userAnswer == chemicalElementFormula) {
    moveToNextQuestion();
  }
}
function moveToNextQuestion() {
  if (randomModeToggle.checked) {
    if (!list.listToRandomChemicalElement()) {
      replay();
    }
  } else {
    list.listToNextChemicalElement();
  }
  hideChemicalElementFormula();
  displayChemicalElementName();
  if (list.isListFinished()) {
    replay();
  }
}
function replay() {
  quizInput.disabled = true;
  list.elementIndex = list.elementsNameFormulaArr.length;
  displayChemicalElementName();
  replayButton.classList.remove("quiz__replay-btn--hidden");
}
submitAnswerButton.addEventListener("click", () => {
  checkAnswer();
});
skipButton.addEventListener("click", () => {
  displayChemicalElementFormula();
  displayDefinitionImage();
});
replayButton.addEventListener("click", () => {
  init();

  replayButton.classList.add("quiz__replay-btn--hidden");
});
quizOptionsMenuReplayButton.addEventListener("click", () => {
  init();
  replayButton.classList.add("quiz__replay-btn--hidden");
  quizOptionsMenuReplayButton.classList.toggle("quiz__options-menu-replay-btn--active");
});
swapFormulaNameButton?.addEventListener("click", () => {
  const placeholder = quizInput.placeholder;
  quizInput.placeholder =
    placeholder == "впишите имя элемента" ? "впишите формулу" : "впишите имя элемента";

  list.swapFormulaName();
  displayChemicalElementName();
  swapFormulaNameButton.classList.toggle("quiz__options-menu-btn--active");
});
optionsMenuToggleButton.addEventListener("click", () => {
  quizOptionsMenu.classList.toggle("quiz__options-menu--hidden");
  instructionsToggleButton.classList.toggle("quiz__toggle-btn--unactive");
});
instructionsToggleButton?.addEventListener("click", () => {
  quizInstructions.classList.toggle("quiz__quiz-instructions--hidden");
  optionsMenuToggleButton.classList.toggle("quiz__toggle-btn--unactive");
});
function displayDefinitionImage() {
  definitionImage.src = "rcs/definitions-img/" + list.getCurrentDefinitionImage();
}
