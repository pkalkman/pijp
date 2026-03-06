<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { FormSubmitEvent } from '@primevue/forms';
import { z } from 'zod';
import { payloadLoginSchema } from '#shared/payload/payload.login';

const resolver = ref(zodResolver(payloadLoginSchema));
type Schema = z.infer<typeof payloadLoginSchema>;

const initialValues = reactive<Schema>({
  email: '',
  password: '',
});

const loginMessage = ref('');

const authStore = useAuth();

const onFormSubmit = async ($event: FormSubmitEvent) => {
  const { valid, values } = $event;
  if (valid) {
    const { email, password } = values as Schema;
    const result = await authStore.loginMetEmail(email, password);

    if (result?.errorMessage) {
      loginMessage.value = result.errorMessage;
    }
  }
};
</script>

<template>
  <Card class="mx-auto md:mt-12 md:w-6/12">
    <template #title>
      <div class="flex justify-center">
        <h1>Login</h1>
      </div>
      <div class="mt-6 flex justify-center text-base">
        <p>Welkom terug</p>
      </div>
    </template>
    <template #content>
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        class="my-8 flex flex-col gap-4 w-full"
        @submit="onFormSubmit"
        :validateOnValueUpdate="false"
        :validateOnBlur="true"
      >
        <div class="flex flex-col gap-1">
          <label class="font-bold ml-1">E-mail</label>
          <InputText name="email" type="text" size="small" placeholder="E-mail" fluid autofocus />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-bold ml-1">Wachtwoord</label>
          <Password name="password" type="text" size="small" placeholder="Wachtwoord" fluid :feedback="false" :toggle-mask="true" />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}</Message>
        </div>
        <div class="flex justify-end">
          <Button label="Inloggen" size="small" type="submit" />
        </div>
      </Form>

      <Message v-if="loginMessage" class="my-4" severity="error">{{ loginMessage }}</Message>
    </template>
  </Card>
</template>
