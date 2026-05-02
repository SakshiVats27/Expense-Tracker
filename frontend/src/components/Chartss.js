import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../utils/seperator';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export function Chartss({ exdata, categorySummary }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Rent', 'Bills', 'Other'];

  let totalexp = new Array(categories.length).fill(0);

  if (Array.isArray(categorySummary) && categorySummary.length > 0) {
    const map = new Map(categorySummary.map(r => [r._id, r.total]));
    totalexp = categories.map(c => map.get(c) || 0);
  } else if (Array.isArray(exdata) && exdata.length > 0) {
    // Back-compat fallback: derive from full list (not recommended for large datasets).
    const expenseData = (exdata || []).filter(item => item.type === 'expense');
    totalexp = sortCategoryWise(expenseData, categories);
  }

  const hasData = totalexp.some(val => val > 0);

  // Color palette aligned with Items.js categories
  const backgroundColors = [
    'rgba(249, 115, 22, 0.6)',   // Grocery (orange)
    'rgba(99, 102, 241, 0.6)',   // Vehicle (indigo)
    'rgba(236, 72, 153, 0.6)',   // Shopping (pink)
    'rgba(6, 182, 212, 0.6)',    // Travel (cyan)
    'rgba(244, 63, 94, 0.6)',    // Food (rose)
    'rgba(217, 70, 239, 0.6)',   // Fun (fuchsia)
    'rgba(139, 92, 246, 0.6)',   // Rent (violet)
    'rgba(239, 68, 68, 0.6)',    // Bills (red)
    'rgba(156, 163, 175, 0.6)'    // Other (gray)
  ];

  const borderColors = [
    'rgba(249, 115, 22, 1)',
    'rgba(99, 102, 241, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(244, 63, 94, 1)',
    'rgba(217, 70, 239, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(156, 163, 175, 1)'
  ];

  const chartData = hasData ? {
    labels: categories,
    datasets: [{
      label: 'Amount (Rs.)',
      data: totalexp,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1.5,
      hoverOffset: 10,
      hoverBorderWidth: 2
    }]
  } : {
    labels: ['No Data'],
    datasets: [{
      data: [1],
      backgroundColor: ['rgba(255, 255, 255, 0.05)'],
      borderColor: ['rgba(255, 255, 255, 0.1)'],
      borderWidth: 1,
      hoverOffset: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: hasData,
        position: window.innerWidth < 768 ? 'bottom' : 'right',
        labels: {
          color: '#e2e8f0',
          font: {
            size: window.innerWidth < 768 ? 12 : 14,
            family: "'Montserrat', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: hasData,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: Rs. ${value.toLocaleString()} (${percentage}%)`;
          }
        },
        titleFont: {
          family: "'Montserrat', sans-serif"
        },
        bodyFont: {
          family: "'Montserrat', sans-serif"
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div className="w-full h-full p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm relative overflow-hidden min-w-0">
      <div className="flex items-center justify-center gap-2 mb-4">
        <PieChart className="text-primary shrink-0" size={22} />
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide text-center">
          Expense Distribution
        </h2>
      </div>

      <div className="w-full h-[240px] xs:h-[280px] md:h-[320px] lg:h-[350px] relative">
        {!hasData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <p className="text-gray-500 font-medium">No expenses recorded</p>
            <p className="text-[10px] text-gray-600 uppercase mt-1">Add data to see distribution</p>
          </div>
        )}
        <Doughnut 
          data={chartData} 
          options={options}
          aria-label="Expense category breakdown chart"
        />
      </div>
    </div>
  );
}
