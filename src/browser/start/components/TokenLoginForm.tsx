import { Button, FormControl, FormHelperText, makeStyles, TextField } from '@material-ui/core';
import React, { ChangeEvent, FormEvent, memo, useCallback, useState } from 'react';
import { User } from '../../../core/user';
import { authorizeByOAuth2Token } from '../remotes/github';

interface Props {
  onLogin: (user: User) => void;
}

const useTokenLoginFormStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  submitButtonWrapper: {
    display: 'flex',
  },
}));

function TokenLoginForm({ onLogin }: Props) {
  const classes = useTokenLoginFormStyles([]);
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleTokenValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await authorizeByOAuth2Token(token);
      onLogin(user);
    } catch {
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  }, [token, onLogin]);

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.form}
      noValidate
      autoComplete="false"
    >
      <FormControl error={showError}>
        <TextField
          id="token-input"
          label="Access Token"
          value={token}
          onChange={handleTokenValueChange}
          margin="normal"
          variant="filled"
        />
        {showError ? <FormHelperText>Invalid token</FormHelperText> : null}
      </FormControl>
      <div className={classes.submitButtonWrapper}>
        <Button
          variant="contained"
          color="primary"
          disabled={token.trim() === '' || submitting}
        >
          Login
        </Button>
      </div>
    </form>
  );
}

export default memo(TokenLoginForm);
