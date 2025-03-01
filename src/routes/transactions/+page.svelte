<script>
    import { transactionStore } from '$lib/stores/transactionStore';
    import { onMount } from 'svelte';

    let transactions = [];
    let revenueStats = { daily: 0, weekly: 0, total: 0 };
    let dateFilter = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    };

    onMount(async () => {
        transactions = await transactionStore.getTransactionsByDate(
            new Date(dateFilter.start),
            new Date(dateFilter.end)
        );
        revenueStats = await transactionStore.getRevenueStats();
    });

    async function updateDateFilter() {
        transactions = await transactionStore.getTransactionsByDate(
            new Date(dateFilter.start),
            new Date(dateFilter.end)
        );
    }
</script>

<div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Transaction History</h1>

    <!-- Revenue Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Daily Revenue</h3>
            <p class="text-2xl">${revenueStats.daily.toFixed(2)}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Weekly Revenue</h3>
            <p class="text-2xl">${revenueStats.weekly.toFixed(2)}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold mb-2">Total Revenue</h3>
            <p class="text-2xl">${revenueStats.total.toFixed(2)}</p>
        </div>
    </div>

    <!-- Date Filter -->
    <div class="flex gap-4 mb-6">
        <div>
            <label class="block text-sm font-medium mb-1" for="start-date">Start Date</label>
            <input
                type="date"
                id="start-date"
                bind:value={dateFilter.start}
                on:change={updateDateFilter}
                class="border rounded p-2"
            />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1" for="end-date">End Date</label>
            <input
                type="date"
                id="end-date"
                bind:value={dateFilter.end}
                on:change={updateDateFilter}
                class="border rounded p-2"
            />
        </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Payment Method
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Points Earned
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                {#each transactions as tx}
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap text-sm">{tx.transactionId}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">${tx.amount.toFixed(2)}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">{tx.paymentMethod}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">{tx.pointsEarned}</td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No transactions found for the selected date range
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div> 