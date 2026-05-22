import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ClubListItem } from '@/features/onboarding/ui/ClubListItem';
import { OnboardingStepper } from '@/features/onboarding/ui/OnboardingStepper';
import { useClubsPage } from '@/pages/onboarding-clubs/model/useClubsPage';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';
import { SearchField } from '@/shared/ui/SearchField/SearchField';
import styles from './page.module.css';

export const OnboardingClubsPage = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    selectedIds,
    toggleClub,
    groupedByLeague,
    isCatalogUnavailable,
    isSearchEmpty,
    hasLeagues,
    canContinue,
    saveAndContinue,
    selectedCount,
    leagueCount,
  } = useClubsPage();

  if (!hasLeagues) {
    return <Navigate to="/onboarding/leagues" replace />;
  }

  const handleContinue = () => {
    if (!canContinue) return;
    saveAndContinue();
    navigate('/matches');
  };

  return (
    <Screen
      eyebrow="Онбординг"
      title="Любимые клубы"
      subtitle={`Клубы из ${leagueCount} ${leagueCount === 1 ? 'лиги' : 'лиг'} — можно выбрать несколько`}
      footer={
        <>
          <p className={styles.selectionHint}>
            {selectedCount > 0 ? `Выбрано: ${selectedCount}` : 'Выбери хотя бы один клуб'}
          </p>
          <Button fullWidth disabled={!canContinue} onClick={handleContinue}>
            К матчам
          </Button>
          <OnboardingStepper current={2} total={3} />
          <Link className={styles.backLink} to="/onboarding/leagues">
            ← Изменить лиги
          </Link>
        </>
      }
    >
      <SearchField value={search} onChange={setSearch} placeholder="Поиск клуба" />

      {isCatalogUnavailable ? (
        <div className={styles.catalogNotice}>
          <p className={styles.empty}>
            Клубы для выбранных лиг появятся, когда бэкенд отдаст каталог команд. Сейчас
            подключены только лиги из API.
          </p>
          <p className={styles.hint}>
            Следующий шаг — каталог клубов с бэкенда для выбранных лиг.
          </p>
        </div>
      ) : isSearchEmpty ? (
        <p className={styles.empty}>Ничего не найдено. Попробуй другой запрос.</p>
      ) : (
        groupedByLeague.map(({ leagueId, leagueName, clubs }) => (
          <section key={leagueId} className={styles.leagueSection}>
            <h2 className={styles.sectionLabel}>
              <span className={styles.sectionBar} />
              {leagueName}
            </h2>
            <ul className={styles.list}>
              {clubs.map((club) => (
                <li key={club.id}>
                  <ClubListItem
                    club={club}
                    selected={selectedIds.includes(club.id)}
                    onToggle={toggleClub}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </Screen>
  );
};
