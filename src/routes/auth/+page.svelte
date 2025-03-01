<!-- src/routes/auth/+page.svelte -->
<script>
  import { authStore } from '$lib/stores/authStore';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let isLogin = true;
  let email = '';
  let password = '';
  let name = '';
  let error = '';

  async function handleSubmit() {
    error = '';
    
    try {
      if (isLogin) {
        // Simulate login API call
        if (email === 'admin@example.com' && password === 'admin123') {
          authStore.login({
            email,
            name: 'Admin User',
            role: 'admin'
          });
          goto('/');
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Simulate registration API call
        if (email && password && name) {
          authStore.login({
            email,
            name,
            role: 'user'
          });
          goto('/');
        } else {
          throw new Error('All fields are required');
        }
      }
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8" in:fade>
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {isLogin ? 'Sign in to your account' : 'Create a new account'}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <button
          class="font-medium text-blue-600 hover:text-blue-500"
          on:click={() => {
            isLogin = !isLogin;
            error = '';
          }}
        >
          {isLogin ? 'create a new account' : 'sign in to existing account'}
        </button>
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm -space-y-px">
        {#if !isLogin}
          <div>
            <label for="name" class="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              bind:value={name}
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Full name"
            />
          </div>
        {/if}
        
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            bind:value={email}
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 {isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            bind:value={password}
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Password"
          />
        </div>
      </div>

      {#if error}
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      {/if}

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLogin ? 'Sign in' : 'Register'}
        </button>
      </div>
    </form>
  </div>
</div> 