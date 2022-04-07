import { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { addZero } from '../../helpers/chart.helper';
import IState from '../../interfaces/website-state.interface';
import { useTheme } from '@mui/material';
type Props = {
  states: IState[];
  aggrStates: { avg: number; min: number; max: number } | undefined;
};
export default function Chart({ states, aggrStates }: Props) {
  const theme = useTheme();
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
      group: '',
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
      tickPlacement: 'between',
      tickAmount: 15,
      labels: {
        offsetY: 10,
        hideOverlappingLabels: true,
      },
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
    colors: [theme.palette.info.main],
  });

  useEffect(() => {
    const answerTimes: number[] = [];
    const createdTimes: string[] = [];

    states.forEach(e => {
      if (e.response_time) {
        const date = new Date(e.createdAt);
        const time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
        answerTimes.push(e.response_time);
        createdTimes.push(time);
      }
    });

    setSeries([{ data: answerTimes }]);
    setOptions({ xaxis: { categories: createdTimes } });
  }, [states.length]);

  return (
    <>
      <ReactApexChart options={options} series={series} type="area" height={350} />
      <div className="d-flex aggregates justify-content-center w-100 text-center">
        <div className="me-5">
          Average
          <br />
          <p style={{ color: 'black' }}>{Math.round(aggrStates ? aggrStates.avg : 0) / 1000} Sec(s)</p>
        </div>
        <div className="me-5">
          The fastest
          <br />
          <p style={{ color: 'black' }}>{(aggrStates ? aggrStates.min : 0) / 1000} Sec(s)</p>
        </div>
        <div className="me-5">
          The slowest
          <br />
          <p style={{ color: 'black' }}>{(aggrStates ? aggrStates.max : 0) / 1000} Sec(s)</p>
        </div>
      </div>
    </>
  );
}
