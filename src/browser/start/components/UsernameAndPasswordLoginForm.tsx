import { Button, FormControl, FormHelperText, makeStyles, TextField } from '@material-ui/core';
import { AxiosError } from 'axios';
import React, { ChangeEvent, FormEvent, memo, useCallback, useMemo, useState } from 'react';
import { User } from '../../core/models';
import { authorizeByBasic } from '../remotes/github';

interface Props {
  onLogin: (user: User) => void;
}

const useUsernameAndPasswordLoginFormStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  submitButtonWrapper: {
    display: 'flex',
  },
}));

function UsernameAndPasswordLoginForm({ onLogin }: Props) {
  const classes = useUsernameAndPasswordLoginFormStyles([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [needOtp, setNeedOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleUsernameValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handlePasswordValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const handleOtpValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  }, []);

  const canSubmit = useMemo(() => {
    return needOtp ? otp.length === 6 : (username.trim() !== '' && password.trim() !== '');
  }, [needOtp, otp, username, password]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    if (canSubmit) {
      try {
        let user;

        if (needOtp) {
          user = await authorizeByBasic(username, password, otp);
        } else {
          user = await authorizeByBasic(username, password);
        }

        onLogin(user);
      } catch (error) {
        if (isOtpNeededError(error)) {
          setShowError(false);
          setNeedOtp(true);
        } else {
          setShowError(true);
        }
      } finally {
        setSubmitting(false);
      }
    }
  }, [username, password, onLogin, canSubmit, needOtp, otp]);

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.form}
      noValidate
      autoComplete="false"
    >
      {needOtp ? (
        <FormControl error={showError}>
          <TextField
            id="otp-input"
            label="OTP"
            value={otp}
            onChange={handleOtpValueChange}
            margin="normal"
            variant="filled"
          />
          {showError ? <FormHelperText>Invalid otp</FormHelperText> : null}
        </FormControl>
      ) : (
        <>
          {showError
            ? <FormHelperText error={true}>Invalid username or password</FormHelperText>
            : null}
          <TextField
            id="username-input"
            label="Username"
            value={username}
            onChange={handleUsernameValueChange}
            margin="normal"
            variant="filled"
          />
          <TextField
            id="password-input"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordValueChange}
            margin="normal"
            variant="filled"
          />
        </>
      )}
      <div className={classes.submitButtonWrapper}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!canSubmit || submitting}
        >
          Login
        </Button>
      </div>
    </form>
  );
}

export default memo(UsernameAndPasswordLoginForm);

function isOtpNeededError(error: unknown): boolean {
  if (typeof error === 'object' && error != null && (error as any).response != null) {
    const response = (error as AxiosError).response;

    if (response !== undefined && response.data) {
      const { message } = response.data as any;
      return message != null && (message as string).includes('two-factor authentication OTP code');
    }
  }

  return false;
}
