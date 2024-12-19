<template>
  <Dialog :visible="isVisible" :modal="true" header="Modifier le profil" :style="{ width: '450px' }" class="p-fluid"
    @update:visible="handleVisibilityChange">
    <div class="flex flex-column gap-4">
      <div class="field">
        <label for="username">Nouveau nom d'utilisateur</label>
        <InputText id="username" v-model="formData.username" :class="{ 'p-invalid': errors.username }"
          @blur="validateUsername" minlength="3" />
        <small class="p-error" v-if="errors.username">
          {{ errors.username }}
        </small>
      </div>

      <div class="field">
        <label for="old_password">Mot de passe actuel*</label>
        <Password id="old_password" v-model="formData.old_password" :feedback="false" :toggleMask="true"
          :class="{ 'p-invalid': errors.old_password }" @blur="validateOldPassword" required />
        <small class="p-error" v-if="errors.old_password">
          {{ errors.old_password }}
        </small>
      </div>

      <div class="field">
        <label for="new_password">Nouveau mot de passe</label>
        <Password id="new_password" v-model="formData.new_password" :toggleMask="true"
          :class="{ 'p-invalid': errors.new_password }" @blur="validateNewPassword" @input="validatePasswordConfirm"
          minlength="8" />
        <small class="p-error" v-if="errors.new_password">
          {{ errors.new_password }}
        </small>
      </div>

      <div class="field">
        <label for="new_password_confirm">Confirmer le nouveau mot de passe</label>
        <Password id="new_password_confirm" v-model="formData.new_password_confirm" :feedback="false" :toggleMask="true"
          :class="{ 'p-invalid': errors.new_password_confirm }" @blur="validatePasswordConfirm" />
        <small class="p-error" v-if="errors.new_password_confirm">
          {{ errors.new_password_confirm }}
        </small>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="Annuler" icon="pi pi-times" @click="closeDialog" class="p-button-text" :disabled="loading" />
        <Button label="Enregistrer" icon="pi pi-check" @click="handleSubmit" :loading="loading" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useUserService } from '@/composables/user/userService';
import { useToast } from 'primevue/usetoast';
import type { EditUserDTO } from '@/modelDTO/EditUser.dto';
import { useAuthStore } from '@/stores/authStore';
import { AxiosError } from 'axios';

const authStore = useAuthStore();

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'profile-updated'): void
}>();

// Utiliser un computed pour la visibilité
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const handleVisibilityChange = (value: boolean) => {
  emit('update:visible', value);
  if (!value) {
    resetForm();
  }
};

const toast = useToast();
const userService = useUserService();
const loading = ref(false);

const formData = reactive<EditUserDTO>({
  username: '',
  old_password: '',
  new_password: '',
  new_password_confirm: ''
});

const errors = reactive({
  username: '',
  old_password: '',
  new_password: '',
  new_password_confirm: ''
});

const validateUsername = () => {
  errors.username = '';
  if (formData.username && formData.username.length < 3) {
    errors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
  }
};

const validateOldPassword = () => {
  errors.old_password = '';
  if (!formData.old_password) {
    errors.old_password = 'Le mot de passe actuel est requis';
  }
};

const validateNewPassword = () => {
  errors.new_password = '';
  if (formData.new_password && formData.new_password.length < 8) {
    errors.new_password = 'Le nouveau mot de passe doit contenir au moins 8 caractères';
  }
};

const validatePasswordConfirm = () => {
  errors.new_password_confirm = '';
  if (formData.new_password && formData.new_password_confirm !== formData.new_password) {
    errors.new_password_confirm = 'Les mots de passe ne correspondent pas';
  }
};

const validateForm = (): boolean => {
  let isValid = true;

  // Validate required old password
  validateOldPassword();
  if (errors.old_password) {
    isValid = false;
  }

  // Validate username if provided
  if (formData.username) {
    validateUsername();
    if (errors.username) {
      isValid = false;
    }
  }

  // Validate new password if provided
  if (formData.new_password) {
    validateNewPassword();
    validatePasswordConfirm();
    if (errors.new_password || errors.new_password_confirm) {
      isValid = false;
    }
  }

  return isValid;
};

const resetForm = () => {
  // Reset form data
  Object.assign(formData, {
    username: '',
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });

  // Reset errors
  Object.assign(errors, {
    username: '',
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  });
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;

    const dataToSubmit: EditUserDTO = {
      old_password: formData.old_password
    };

    if (formData.username) {
      dataToSubmit.username = formData.username;
    }

    if (formData.new_password) {
      dataToSubmit.new_password = formData.new_password;
    }

    if (formData.new_password_confirm) {
      dataToSubmit.new_password_confirm = formData.new_password_confirm;
    }

    await userService.editUser(dataToSubmit);

    if (formData.username) {
      authStore.updateUsername(formData.username);
    }

    emit('profile-updated');
    handleVisibilityChange(false);
  } catch (error) {
    if (error instanceof AxiosError) {
      switch (error?.response?.status) {
        case 409:
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Le nom d\'utilisateur est déjà utilisé',
            life: 3000
          });
          break;
        case 401:
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Le mot de passe actuel est incorrect',
            life: 3000
          });
          break;
        case 400:
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Les mots de passes doivent correspondre',
            life: 3000
          });
          break;
        default:
          toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la mise à jour du profil',
            life: 3000
          });
          break;
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Une erreur est survenue lors de la mise à jour du profil',
        life: 3000
      });
    }
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  handleVisibilityChange(false);
};
</script>

<style scoped>
.p-dialog .p-dialog-header {
  border-bottom: 1px solid var(--surface-border);
}

.field small {
  display: block;
  margin-top: 0.25rem;
}

.p-password {
  width: 100%;
}
</style>
