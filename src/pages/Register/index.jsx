import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { btn, form } from '../../lib/ui.js';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate('/trips');
    } catch (err) {
      setError('root', { message: err.message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-[380px] rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-[22px] font-bold text-gray-900">Create account</h1>

        <form className={form.stack} onSubmit={handleSubmit(onSubmit)}>
          <div className={form.field}>
            <label className={form.label}>Name</label>
            <input {...register('name')} className={form.control} />
            {errors.name && <span className={form.error}>{errors.name.message}</span>}
          </div>

          <div className={form.field}>
            <label className={form.label}>Email</label>
            <input {...register('email')} type="email" className={form.control} />
            {errors.email && <span className={form.error}>{errors.email.message}</span>}
          </div>

          <div className={form.field}>
            <label className={form.label}>Password</label>
            <input {...register('password')} type="password" className={form.control} />
            {errors.password && <span className={form.error}>{errors.password.message}</span>}
            <span className={form.hint}>At least 8 characters</span>
          </div>

          {errors.root && <span className={form.error}>{errors.root.message}</span>}

          <button type="submit" disabled={isSubmitting} className={btn.primary}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-[13px] text-gray-500">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
