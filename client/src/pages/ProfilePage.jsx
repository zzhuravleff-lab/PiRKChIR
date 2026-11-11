import { useEffect, useState } from 'react';
import { getCurrentUser } from '../api/authApi.js';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Выносим загрузку в отдельную функцию, чтобы вызывать её по кнопке
  async function loadProfile(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const data = await getCurrentUser();
      setProfile(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Загружаем при первом открытии страницы
  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => loadProfile()}
      />
    );
  }

  const registeredAt = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.createdAt));

  return (
    <section className="profileCard">
      <div className="profileHeader">
        <p className="eyebrow">Личный кабинет</p>
        <button
          className="ghostButton"
          type="button"
          onClick={() => loadProfile(true)}
          disabled={refreshing}
        >
          {refreshing ? 'Обновление...' : 'Обновить данные'}
        </button>
      </div>
      <h1>{profile.name}</h1>

      <dl className="profileGrid">
        <div>
          <dt>Email</dt>
          <dd>{profile.email}</dd>
        </div>
        <div>
          <dt>Количество задач</dt>
          <dd>{profile.taskCount}</dd>
        </div>
        <div>
          <dt>Дата регистрации</dt>
          <dd>{registeredAt}</dd>
        </div>
      </dl>
    </section>
  );
}