import open from 'open'
import readline from 'readline'
import util from 'util'

const workDayHours = 9

async function start () {
  printStartAndEndInfo();
  await promptToProceed();
  printTasks();
  await promptToProceed();
  openUrlsForReview();
}

function stop () {
  console.info(`You finished at ${new Date().toTimeString()}.`)
  open('https://www.rescuetime.com/browse/highlights')
}

function printStartAndEndInfo() {
  const startTime = new Date();
  const endTime = new Date(new Date(startTime).setHours(startTime.getHours() + workDayHours));

  const startTimeMessage = `You've started your work day at ${startTime.toTimeString()}.`;
  const startTimeAdvice = "Remember to eat the frog first 🐸";

  const endTimeMessage = `You should aim to finish at ${endTime.toTimeString()}.`;
  const endTimeAdvice = "Remember that finishing on time isn't just good for you it's good for others who depend on you too 🏡";

  console.info(startTimeMessage, startTimeAdvice);
  console.info(endTimeMessage, endTimeAdvice);
}

async function promptToProceed() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });  
  const question = util.promisify(rl.question).bind(rl);

  try {
    await question('\nPress enter to proceed...\n')
    rl.close()
  } catch (err) {
    console.error('Question rejected', err)
  }
}

function printTasks() {
  console.info('• Check calendar. Identify any prep needed for events.')
  console.info('• Check emails. Identify any issues or todos.')
  console.info('• Check Slack, including saved messages.')
  console.info("• Check #support-eng-planning")
  console.info('• Check GitHub notifications.')
  console.info("• Check UI tests. Poke people about broken and skipped tests.")
  console.info("• Prioritise today's todos and consider adding a 🐸")
}

function openUrlsForReview() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // open(`https://www.rescuetime.com/browse/highlights/for/the/day/of/${yesterday.toISOString().split('T')[0]}`);
  open(`https://www.rescuetime.com/daily-highlights/for/the/day/of/${yesterday.toISOString().split('T')[0]}`);
  // open('https://engineering-dashboard.stagingadministratehq.com/d/n6TYXBFMk/team-statistics?orgId=1');
}

export default {start, stop}