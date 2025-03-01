<!-- src/routes/auth/+page.svelte -->
<script>
  import { authStore } from '$lib/stores/authStore';
  import { notificationStore } from '$lib/stores/notificationStore';
  import { goto } from '$app/navigation';

  let isLogin = true;
  let email = '';
  let password = '';
  let name = '';

  async function handleSubmit() {
    if (isLogin) {
      try {
        await authStore.login(email, password);
        notificationStore.add({
          type: 'success',
          message: 'Welcome back!'
        });
        goto('/');
      } catch (error) {
        notificationStore.add({
          type: 'error',
          message: 'Invalid credentials'
        });
      }
    } else {
      try {
        await authStore.register(email, password, name);
        notificationStore.add({
          type: 'success',
          message: 'Registration successful! Please login.'
        });
        isLogin = true;
      } catch (error) {
        notificationStore.add({
          type: 'error',
          message: 'Registration failed. Please try again.'
        });
      }
    }
  }
</script>

<div class="min-h-[80vh] flex items-center justify-center">
  <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {isLogin ? 'Welcome Back!' : 'Create Account'}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          on:click={() => isLogin = !isLogin}
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      {#if !isLogin}
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            bind:value={name}
            required
            class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
          />
        </div>
      {/if}
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-white"
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLogin ? 'Sign in' : 'Create account'}
        </button>
      </div>
    </form>
  </div>
</div> 