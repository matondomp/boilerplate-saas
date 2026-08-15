# Authentication Module BDD Scenarios

## Feature: User Authentication

In order to access personal data and perform actions
As a user
I want to be able to authenticate myself

### Scenario: Successful Login

Given the user has navigated to the login page
When the user enters a valid username and password
And clicks on the login button
Then the user should be redirected to the dashboard
And a success message "Conectado!" should be displayed

### Scenario: Unsuccessful Login With Invalid Credentials

Given the user has navigated to the login page
When the user enters an invalid username or password
And clicks on the login button
Then the user should remain on the login page
And an error message "Username ou senha inválidas!" should be displayed

### Scenario: Unsuccessful Login With Locked Account

Given the user has navigated to the login page
When the user enters credentials for a locked account
And clicks on the login button
Then the user should remain on the login page
And an error message "A sua conta está bloqueada. Por favor, contacte o seu administrador." should be displayed

### Scenario: Attempting to Login When Already Authenticated

Given the user is already logged in
When the user navigates to the login page
Then the user should be redirected to the dashboard

### Scenario: Logout

Given the user is logged in
When the user clicks on the logout button
Then the user should be redirected to the login page
And a success message "Desconectado com sucesso!" should be displayed

### Scenario: Password Reset Request

Given the user has navigated to the login page
When the user clicks on the "Esqueceu a sua senha?" link
And enters their email address
And clicks on "Enviar instruções de redefinição de senha"
Then an email should be sent to the user
And a message "Email de recuperação de senha enviado!" should be displayed

### Scenario: Password Reset With Expired Token

Given the user has received a password reset email
When the user clicks on the reset link with an expired token
Then the user should be informed that the token is expired
And prompted to request a new password reset

### Scenario: Password Reset With Invalid Token

Given the user has received a password reset email
When the user clicks on the reset link with an invalid token
Then the user should be informed that the token is invalid

### Scenario: Successful Password Reset

Given the user has received a password reset email
When the user clicks on the reset link with a valid token
And enters a new password and confirms it
And clicks on the "Redefinir senha" button
Then the user should be redirected to the login page
And a success message "Senha alterada com sucesso" should be displayed

### Scenario: Unsuccessful Password Reset Due to Password Mismatch

Given the user has received a password reset email
When the user clicks on the reset link with a valid token
And enters a new password but the confirmation does not match
And clicks on the "Redefinir senha" button
Then the user should remain on the password reset page
And an error message "Verifique a confirmação da senha!" should be displayed
