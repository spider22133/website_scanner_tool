import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { addZero } from '../../helpers/chart.helper';
import IState from '../../interfaces/website-state.interface';
type Props = {
  states: IState[];
};
export default function Chart({ states }: Props) {
  const [series, setSeries] = useState<ApexAxisChartSeries>([
    {
      name: 'Answer Time:',
      data: [0],
    },
  ]);

  const [options, setOptions] = useState<ApexOptions>({
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
      categories: [0],
    },
    yaxis: {
      labels: {
        formatter: (v: number) => v + ' ms',
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
  });

  useEffect(() => {
    const answerTimes: number[] = [];
    const createdTimes: string[] = [];

    states.forEach(e => {
      const date = new Date(e.createdAt);
      const time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
      answerTimes.push(e.answer_time);
      createdTimes.push(time);
    });

    setSeries([{ data: answerTimes }]);
    setOptions({ xaxis: { categories: createdTimes } });
  }, [states.length]);

  return (
    <>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </>
  );
}
