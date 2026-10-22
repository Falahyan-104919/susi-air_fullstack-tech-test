<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-wrapper">
        <img
          src="/images/susiair-logo.png"
          alt="Susi Air Logo"
          class="login-logo"
        />
      </div>

      <div class="header-text">
        <h1 class="title">Pilot Operations Portal</h1>
        <p class="subtitle">Enter your flight operations credentials</p>
      </div>

      <!-- Quick Fill Reviewer Callout -->
      <div class="demo-banner">
        <div class="demo-info">
          <span class="demo-badge">Test Account</span>
          <span class="demo-creds"><code>johndoe</code> / <code>susiairtest</code></span>
        </div>
        <button
          type="button"
          class="demo-fill-btn"
          @click="fillDemoCredentials"
        >
          Auto-fill
        </button>
      </div>

      <!-- Error Banner -->
      <div v-if="authStore.error" class="error-banner">
        <AlertCircle class="error-icon" :size="18" />
        <span class="error-message">{{ authStore.error }}</span>
      </div>

      <form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="input-wrapper">
            <User class="input-icon" :size="18" />
            <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="e.g. johndoe"
              autocomplete="username"
              required
              :disabled="authStore.isLoading"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrapper">
            <Lock class="input-icon" :size="18" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="••••••••"
              autocomplete="current-password"
              required
              :disabled="authStore.isLoading"
            />
            <button
              type="button"
              class="toggle-password"
              tabindex="-1"
              @click="showPassword = !showPassword"
            >
              <component :is="showPassword ? EyeOff : Eye" :size="18" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="authStore.isLoading"
        >
          <Loader2 v-if="authStore.isLoading" class="spinner-icon" :size="20" />
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="footer-note">
        <span>PT ASI Pudjiastuti Aviation</span>
        <span class="separator">•</span>
        <span>Flight Duty Compliance</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const username = ref('johndoe');
const password = ref('susiairtest');
const showPassword = ref(false);

function fillDemoCredentials() {
  username.value = 'johndoe';
  password.value = 'susiairtest';
}

async function handleSubmit() {
  if (!username.value || !password.value) return;
  try {
    await authStore.login(username.value, password.value);
    navigateTo('/home');
  } catch {
    // Error is set in authStore.error
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  background-color: $color-canvas;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: $color-surface;
  border-radius: $radius-xl;
  border: 1px solid $color-border;
  box-shadow: $shadow-card;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .login-logo {
    height: 44px;
    width: auto;
    object-fit: contain;
  }
}

.header-text {
  text-align: center;
  margin-bottom: 24px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: $color-navy;
    margin-bottom: 6px;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 13px;
    color: $color-slate;
  }
}

.demo-banner {
  background-color: rgba(14, 33, 56, 0.04);
  border: 1px dashed rgba(14, 33, 56, 0.15);
  border-radius: $radius-md;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .demo-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .demo-badge {
    font-size: 10px;
    font-weight: 700;
    color: $color-slate;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .demo-creds {
    font-size: 12px;
    color: $color-navy;

    code {
      font-family: monospace;
      background-color: rgba(14, 33, 56, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 600;
    }
  }

  .demo-fill-btn {
    font-size: 11px;
    font-weight: 600;
    color: $color-red;
    background-color: $color-red-light;
    padding: 4px 10px;
    border-radius: $radius-sm;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: darken(#FDE8EC, 5%);
    }
  }
}

.error-banner {
  background-color: $color-danger-bg;
  border: 1px solid rgba(230, 55, 87, 0.3);
  border-radius: $radius-md;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: $color-danger;

  .error-icon {
    flex-shrink: 0;
  }

  .error-message {
    font-size: 13px;
    font-weight: 500;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .form-label {
    font-size: 13px;
    font-weight: 600;
    color: $color-navy;
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 12px;
    color: $color-slate-light;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 11px 40px 11px 38px;
    background-color: $color-canvas;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-size: 14px;
    color: $color-navy;
    outline: none;
    transition: all 0.15s ease-in-out;

    &::placeholder {
      color: $color-slate-light;
    }

    &:focus {
      background-color: #ffffff;
      border-color: $color-navy;
      box-shadow: 0 0 0 3px rgba(14, 33, 56, 0.08);
    }
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    color: $color-slate;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;

    &:hover {
      color: $color-navy;
    }
  }
}

.submit-button {
  margin-top: 6px;
  width: 100%;
  height: 46px;
  background-color: $color-navy;
  color: #ffffff;
  border-radius: $radius-full;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: $color-navy-dark;
    box-shadow: 0 4px 12px rgba(14, 33, 56, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner-icon {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.footer-note {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: $color-slate-light;

  .separator {
    font-size: 8px;
  }
}
</style>
