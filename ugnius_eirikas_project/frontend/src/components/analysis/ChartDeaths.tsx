import { useQuery } from '@tanstack/react-query';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchLineCharts } from '../../api/Api';
import Loader from '../../common/Loader';
import {
  AccidentDataByMonth,
  DeathDataByMonth,
  LineChartsData,
} from '../../interfaces/analysis/Interfaces';

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartDeaths: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Total accidents',
        data: [],
      },

      {
        name: 'Total deaths',
        data: [],
      },
    ],
  });

  const {
    data: accidentsChartData,
    isLoading,
    isError,
  } = useQuery({
    queryFn: (): Promise<AccidentDataByMonth> =>
      fetchLineCharts('http://127.0.0.1:8000/api/accidents_by_month'),
    queryKey: ['accidentsChartData', '2023'],
    staleTime: Infinity,
  });

  const {
    data: deathChartData,
    isLoading: isLoadingDeathData,
    isError: isErrorDeathData,
  } = useQuery({
    queryFn: (): Promise<DeathDataByMonth[]> =>
      fetchLineCharts('http://127.0.0.1:8000/api/accidents_by_month'),
    queryKey: ['deathChartData', '2023'],
    staleTime: Infinity,
  });

  useEffect(() => {
    if (accidentsChartData && deathChartData && !isLoading && !isError) {
      setState({
        series: [
          {
            name: 'Total accidents',
            data: accidentsChartData.accidents.map(
              (item) => item.total_accidents,
            ),
          },
          {
            name: 'Total deaths',
            data: accidentsChartData.deaths.map((item) => item.total_deaths),
          },
        ],
      });
    }
  }, [accidentsChartData, deathChartData]);

  if (isLoading || isLoadingDeathData)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError || isErrorDeathData) return <div>Error</div>;
  const options: ApexOptions = {
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'left',
    },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'area',
      dropShadow: {
        enabled: true,
        color: '#623CEA14',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: 'straight',
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: '#fff',
      strokeColors: ['#3056D3', '#80CAEE'],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: 'category',
      categories:
        accidentsChartData?.accidents.map((item) => item.year_month) || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: '0px',
        },
      },
      min: 0,
      max: 2650,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total accidents</p>
              <p className="text-sm font-medium">2023-01 - 2023-12</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total deaths</p>
              <p className="text-sm font-medium">2023-01 - 2023-12</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartDeaths;
