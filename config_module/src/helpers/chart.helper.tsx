import { ApexOptions } from 'apexcharts';
import IState from '../interfaces/website-state.interface';

export const getChartData = (data: IState[]): { series: ApexAxisChartSeries; options: ApexOptions } => {
  const answerTimes: number[] = [];
  const createdTimes: string[] = [];

  const addZero = (i: number): string | number => {
    return i < 10 ? '0' + i : i;
  };

  data.forEach(e => {
    const date = new Date(e.createdAt);
    const time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
    answerTimes.push(e.answer_time);
    createdTimes.push(time);
  });

  const series: ApexAxisChartSeries = [
    {
      name: 'Answer Time:',
      data: answerTimes,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        tools: {
          pan: false,
        },
      },
      zoom: {
        enabled: true,
        type: 'x',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Answer Time Overview',
      align: 'left',
      style: {
        fontSize: '18px',
      },
    },
    xaxis: {
      categories: createdTimes,
    },
    yaxis: {
      labels: {
        formatter: v => v + ' ms',
      },
    },
    tooltip: {
      x: {
        format: 'dd/MMM/yyyy - HH:mm',
      },
    },
    legend: {
      horizontalAlign: 'left',
    },
  };

  return { series, options };
};
