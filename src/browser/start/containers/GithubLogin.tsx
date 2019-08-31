import { FormControlLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core';
import React, { memo, useCallback, useState } from 'react';
import { User } from '../../../core/user';
import { userDatabase } from '../../core/user-database';
import TokenLoginForm from '../components/TokenLoginForm';
import UsernameAndPasswordLoginForm from '../components/UsernameAndPasswordLoginForm';
import { postUserLogin } from '../remotes/api';

type LoginType = 'usernameAndPassword' | 'token';

interface Props {
  onComplete: () => void;
}

const useGithubLoginStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
}));

function GithubLogin({ onComplete }: Props) {
  const classes = useGithubLoginStyles([]);
  const [loginType, setLoginType] = useState<LoginType>('usernameAndPassword');
  const handleLoginTypeChange = useCallback((_, value) => {
    setLoginType(value);
  }, []);

  const handleLogin = useCallback(async (user: User) => {
    await userDatabase.update(user);
    await postUserLogin(user);

    onComplete();
  }, [onComplete]);

  return (
    <div className={classes.container}>
      <RadioGroup
        aria-label="Login Type"
        name="loginType"
        value={loginType}
        onChange={handleLoginTypeChange}
      >
        <FormControlLabel
          value="usernameAndPassword"
          control={<Radio/>}
          label="Username and Password"
        />
        <FormControlLabel value="token" control={<Radio/>} label="Token"/>
      </RadioGroup>
      {loginType === 'usernameAndPassword' ? (
        <UsernameAndPasswordLoginForm onLogin={handleLogin}/>
      ) : loginType === 'token' ? (
        <TokenLoginForm onLogin={handleLogin}/>
      ) : null}
    </div>
  );
}

export default memo(GithubLogin);
