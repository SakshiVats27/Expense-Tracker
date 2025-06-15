import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { sortCategoryWise } from '../utils/seperator';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export function Chartss({ exdata }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

  // Color palette aligned with Items.js categories
  const backgroundColors = [
    'rgba(110, 231, 183, 0.6)',  // Grocery (emerald)
    'rgba(96, 165, 250, 0.6)',    // Vehicle (blue)
    'rgba(192, 132, 252, 0.6)',   // Shopping (purple)
    'rgba(251, 191, 36, 0.6)',    // Travel (amber)
    'rgba(251, 113, 133, 0.6)',   // Food (rose)
    'rgba(232, 121, 249, 0.6)',   // Fun (fuchsia)
    'rgba(156, 163, 175, 0.6)'     // Other (gray)
  ];

  const borderColors = [
    'rgba(110, 231, 183, 1)',
    'rgba(96, 165, 250, 1)',
    'rgba(192, 132, 252, 1)',
    'rgba(251, 191, 36, 1)',
    'rgba(251, 113, 133, 1)',
    'rgba(232, 121, 249, 1)',
    'rgba(156, 163, 175, 1)'
  ];

  const data = {
    labels: categories,
    datasets: [{
      label: 'Amount (₹)',
      data: totalexp,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1.5,
      hoverOffset: 10,
      hoverBorderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
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
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
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
    <div className="w-full h-full p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <PieChart className="text-secondary" size={24} />
        <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
          Expense Distribution
        </h2>
      </div>

      <div className="w-full h-[280px] md:h-[320px] lg:h-[350px]">
        <Doughnut 
          data={data} 
          options={options}
          aria-label="Expense category breakdown chart"
        />
      </div>
    </div>
  );
}