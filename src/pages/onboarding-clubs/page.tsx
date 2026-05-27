import { Link, useNavigate } from 'react-router-dom';
import { ClubListItem, OnboardingStepper } from '@/features/onboarding';
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
    loadMoreForLeague,
    isCatalogUnavailable,
    isSearchEmpty,
    canContinue,
    saveAndContinue,
    selectedCount,
    leagueCount,
    loadStatus,
    loadError,
    retryLoad,
    saveStatus,
    saveError,
  } = useClubsPage();

  const handleContinue = async () => {
    if (!canContinue) return;
    if (await saveAndContinue()) navigate('/matches', { state: { fromOnboarding: true } });
  };

  return (
    <Screen
      eyebrow="Онбординг"
      title="Любимые клубы"
      subtitle={`Клубы из ${leagueCount} ${leagueCount === 1 ? 'лиги' : 'лиг'} — можно выбрать несколько`}
      footer={
        <>
          <p className={styles.selectionHint}>
            {saveStatus === 'saving'
              ? 'Сохраняем…'
              : saveError
                ? saveError
                : selectedCount > 0
                  ? `Выбрано: ${selectedCount}`
                  : 'Выбери хотя бы один клуб'}
          </p>
          <Button fullWidth disabled={!canContinue} onClick={() => void handleContinue()}>
            {saveStatus === 'saving' ? 'Сохранение…' : 'К матчам'}
          </Button>
          <OnboardingStepper current={2} total={3} />
          <Link className={styles.backLink} to="/onboarding/leagues">
            ← Изменить лиги
          </Link>
        </>
      }
    >
      {loadStatus === 'loading' ? <p className={styles.stateMessage}>Загружаем клубы…</p> : null}

      {loadStatus === 'error' ? (
        <div className={styles.stateBlock}>
          <p className={styles.stateMessage}>{loadError}</p>
          <Button type="button" onClick={retryLoad}>
            Повторить
          </Button>
        </div>
      ) : null}

      {loadStatus === 'success' ? (
        <>
          <SearchField value={search} onChange={setSearch} placeholder="Поиск клуба" />

          {isCatalogUnavailable ? (
            <p className={styles.empty}>Для выбранных лиг пока нет клубов в каталоге.</p>
          ) : isSearchEmpty ? (
            <p className={styles.empty}>Ничего не найдено. Попробуй другой запрос.</p>
          ) : (
            groupedByLeague.map(
              ({
                leagueId,
                leagueName,
                clubs,
                error,
                canLoadMore,
                isLoadingMore,
                loadMoreError,
              }) => (
                <section key={leagueId} className={styles.leagueSection}>
                  <h2 className={styles.sectionLabel}>
                    <span className={styles.sectionBar} />
                    {leagueName}
                  </h2>

                  {error ? <p className={styles.stateMessage}>{error}</p> : null}

                  {clubs.length > 0 ? (
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
                  ) : null}

                  <div className={styles.loadMoreBlock}>
                    {loadMoreError ? <p className={styles.stateMessage}>{loadMoreError}</p> : null}
                    {canLoadMore ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className={styles.loadMoreButton}
                        disabled={isLoadingMore}
                        onClick={() => void loadMoreForLeague(leagueId)}
                      >
                        {isLoadingMore ? 'Загружаем…' : 'Показать ещё клубы'}
                      </Button>
                    ) : null}
                  </div>
                </section>
              ),
            )
          )}
        </>
      ) : null}
    </Screen>
  );
};
