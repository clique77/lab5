// Підключення модуля readline для зчитування зі стандартного вводу
const readline = require('readline');

// Функція для обчислення тривалості комплексу робіт
function calculateDuration(tasks) {
  let totalDuration = 0;

  // Проходимося по всім завданням
  for (let task of tasks) {
    let optimisticTime = parseFloat(task.optimistic); // Оптимістичний час виконання завдання
    let pessimisticTime = parseFloat(task.pessimistic); // Песимістичний час виконання завдання
    let mostLikelyTime = parseFloat(task.mostLikely); // Найбільш ймовірний час виконання завдання

    // Обчислюємо тривалість за формулою РЕР (резерв часу)
    let duration = (optimisticTime + (4 * mostLikelyTime) + pessimisticTime) / 6;
    totalDuration += duration; // Додаємо до загальної тривалості
  }

  return totalDuration;
}

// Функція для отримання даних від користувача через стандартний ввід
function getTasksFromUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    let tasks = [];
    rl.question('Введіть кількість завдань: ', (numTasks) => {
      numTasks = parseInt(numTasks);
      let count = 0;
      (function askTask() {
        if (count < numTasks) {
          rl.question(`Введіть назву завдання ${count + 1}: `, (taskName) => {
            rl.question(`Введіть оптимістичний час для завдання ${count + 1}: `, (optimisticTime) => {
              rl.question(`Введіть найбільш ймовірний час для завдання ${count + 1}: `, (mostLikelyTime) => {
                rl.question(`Введіть песимістичний час для завдання ${count + 1}: `, (pessimisticTime) => {
                  tasks.push({ name: taskName, optimistic: optimisticTime, mostLikely: mostLikelyTime, pessimistic: pessimisticTime });
                  count++;
                  askTask();
                });
              });
            });
          });
        } else {
          rl.close();
          resolve(tasks);
        }
      })();
    });
  });
}

// Отримуємо дані від користувача та обчислюємо тривалість
async function main() {
  let tasks = await getTasksFromUser();
  let duration = calculateDuration(tasks);
  console.log("Total duration of tasks:", duration);
}

main();
