import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../utils/firebase';

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // GitHub as the only included Auth Provider.
  // You could add and configure more here!
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

function SignInScreen() {
  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
}

export default SignInScreen;
