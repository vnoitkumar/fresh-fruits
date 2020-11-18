(async function init() {
  let questions = [];
  let question = null;
  let questionIndex = 0;

  const questionLoader = document.getElementById('question_loader');
  const questionWrapper = document.getElementById('question_wrapper');
  const questionElement = document.getElementById('question');

  const nextButton = document.getElementById('next_btn');
  const backButton = document.getElementById('back_btn');

  nextButton.addEventListener('click', handelNext);
  backButton.addEventListener('click', handelBack);

  questionIndex = Number(localStorage.getItem('question_index')) || 0;

  const localQuestions =
    (localStorage && JSON.parse(localStorage.getItem('questions'))) || null;

  if (!localQuestions) {
    getQuestions()
      .then(function (_questions) {
        questions = _questions;

        storeQuestionsLocally(questions);
        showQuestion();
      })
      .catch(function (error) {
        console.error(error.message);
      });
  } else {
    questions = localQuestions;

    showQuestion();
  }

  async function getQuestions() {
    const response = await fetch('/api/questions.json');
    const { questions } = await response.json();
    return questions;
  }

  async function storeQuestionsLocally(questions) {
    localStorage.setItem('question_index', 0);

    questions = JSON.stringify(questions);
    localStorage.setItem('questions', questions);
  }

  function showQuestion() {
    question = questions[questionIndex];
    questionElement.innerHTML = question.question;

    questionLoader.style.display = 'none';
    questionWrapper.style.display = 'block';
  }

  function handelNext() {
    if (questionIndex >= questions.length - 1) {
      questionWrapper.style.display = 'none';
      document.getElementById('thank_you').style.display = 'block';
      localStorage.clear();
      return;
    }

    questionIndex = ++questionIndex;

    localStorage.setItem('question_index', questionIndex);

    question = questions[questionIndex];
    if (question) {
      questionElement.innerHTML = question.question;
    }
  }

  function handelBack() {
    if (questionIndex <= 0) {
      return;
    }

    questionIndex = --questionIndex;

    localStorage.setItem('question_index', questionIndex);

    question = questions[questionIndex];
    if (question) {
      questionElement.innerHTML = question.question;
    }
  }
})();
