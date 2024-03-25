const readline = require('readline');

function calculateDuration(tasks) {
  let totalDuration = 0;

  for (let task of tasks) {
    let optimisticTime = parseFloat(task.optimistic); 
    let pessimisticTime = parseFloat(task.pessimistic); 
    let mostLikelyTime = parseFloat(task.mostLikely); 

    let duration = (optimisticTime + (4 * mostLikelyTime) + pessimisticTime) / 6;
    totalDuration += duration;
  }

  return totalDuration;
}

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

async function main() {
  let tasks = await getTasksFromUser();
  let duration = calculateDuration(tasks);
  console.log("Total duration of tasks:", duration);
}

main();
