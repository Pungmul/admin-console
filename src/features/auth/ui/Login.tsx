import { useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../model';
import './Login.css';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.username, data.password);
      if (result?.success) {
        message.success('로그인 성공');
        navigate('/');
      } else {
        message.error(result?.error || '로그인에 실패했습니다.');
      }
    } catch {
      message.error('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
            관리자 로그인
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디
              </label>
              <Controller
                name="username"
                control={control}
                rules={{ required: '아이디를 입력하세요' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="아이디를 입력하세요"
                    size="large"
                    style={{
                      borderColor: '#9ca3af',
                    }}
                    className="focus:border-gray-500"
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: '비밀번호를 입력하세요' }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="비밀번호를 입력하세요"
                    size="large"
                    style={{
                      borderColor: '#9ca3af',
                    }}
                    className="focus:border-gray-500"
                  />
                )}
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              className="bg-blue-400 hover:bg-blue-500 border-blue-400 hover:border-blue-500"
            >
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

