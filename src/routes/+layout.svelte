<script>
  import '../app.css';
  import { authStore } from '$lib/stores/authStore';
  import { themeStore } from '$lib/stores/themeStore';
  import { notificationStore } from '$lib/stores/notificationStore';
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  let showNotifications = false;
  let notifications = [];

  onMount(() => {
    themeStore.initialize();
  });

  $: notifications = $notificationStore;
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold text-gray-800 dark:text-white">Smart Kiosk</span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/" class="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400">
              Dashboard
            </a>
            <a href="/analytics" class="inline-flex items-center px-1 pt-1 text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400">
              Analytics
            </a>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            on:click={() => themeStore.toggleTheme()}
            class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          >
            {#if $themeStore === 'dark'}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            {:else}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            {/if}
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button
              type="button"
              on:click={() => showNotifications = !showNotifications}
              on:keydown={(e) => e.key === 'Enter' && (showNotifications = !showNotifications)}
              class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 relative"
              aria-label="Toggle notifications"
              aria-expanded={showNotifications}
              aria-controls="notifications-panel"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {#if notifications.length > 0}
                <span class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                  {notifications.length}
                </span>
              {/if}
            </button>

            {#if showNotifications}
              <div
                id="notifications-panel"
                transition:slide
                class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                role="dialog"
                aria-label="Notifications"
              >
                {#if notifications.length === 0}
                  <p class="px-4 py-2 text-gray-600 dark:text-gray-400">No notifications</p>
                {:else}
                  {#each notifications as notification}
                    <div
                      class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      on:click={() => notificationStore.markAsRead(notification.id)}
                    >
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {notification.message}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  {/each}
                  <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4">
                    <button
                      on:click={() => notificationStore.clear()}
                      class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Clear all
                    </button>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Auth -->
          {#if $authStore.isAuthenticated}
            <div class="relative">
              <button
                on:click={() => authStore.logout()}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          {:else}
            <a
              href="/auth"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </a>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
