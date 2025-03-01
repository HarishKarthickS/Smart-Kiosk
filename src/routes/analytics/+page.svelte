<!-- src/routes/analytics/+page.svelte -->
<script>
  import { machineStore } from '$lib/stores/machineStore';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartCanvas;
  let chart;

  $: machines = $machineStore;

  onMount(() => {
    // Create chart
    const ctx = chartCanvas.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: machines.map(m => m.name),
        datasets: [
          {
            label: 'Total Orders',
            data: machines.map(m => m.totalOrders),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Orders by Machine'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });

  // Update chart when data changes
  $: if (chart && machines) {
    chart.data.labels = machines.map(m => m.name);
    chart.data.datasets[0].data = machines.map(m => m.totalOrders);
    chart.update();
  }
</script>

<div class="space-y-6">
  <!-- Summary Table -->
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-200">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Machine Performance Summary
      </h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Machine
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock Level
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Orders
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Likes
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each machines as machine}
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {machine.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {machine.location}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    machine.stockLevel < 20
                      ? 'bg-red-100 text-red-800'
                      : machine.stockLevel < 50
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {machine.stockLevel} / {machine.maxStock}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {machine.totalOrders}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {machine.likes}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    machine.status === 'operational'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {machine.status}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Chart -->
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
      Orders Visualization
    </h3>
    <div class="aspect-w-16 aspect-h-9">
      <canvas bind:this={chartCanvas}></canvas>
    </div>
  </div>
</div> 