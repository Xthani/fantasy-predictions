import { useNavigate } from 'react-router-dom';
import { OnboardingStepper } from '@/features/onboarding/ui/OnboardingStepper';
import { LeagueListItem } from '@/features/onboarding/ui/LeagueListItem';
import { useLeaguesPage } from '@/pages/onboarding-leagues/model/useLeaguesPage';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';
import { SearchField } from '@/shared/ui/SearchField/SearchField';
import styles from './page.module.css';

export const OnboardingLeaguesPage = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    selectedIds,
    toggleLeague,
    filteredActive,
    filteredInactive,
    isListEmpty,
    canContinue,
    saveAndContinue,
    selectedCount,
    loadStatus,
    loadError,
    retryLoad,
    saveStatus,
    saveError,
  } = useLeaguesPage();

  const handleContinue = async () => {
    if (!canContinue) return;
    const saved = await saveAndContinue();
    if (saved) navigate('/onboarding/clubs');
  };

  return (
    <Screen
      eyebrow="Онбординг"
      title="Любимые лиги"
      subtitle="Выбери одну или несколько — матчи будем показывать по ним"
      footer={
        <>
          <p className={styles.selectionHint}>
            {saveStatus === 'saving'
              ? 'Сохраняем выбор…'
              : saveError
                ? saveError
                : selectedCount > 0
                  ? `Выбрано: ${selectedCount}`
                  : 'Выбери хотя бы одну активную лигу'}
          </p>
          <Button fullWidth disabled={!canContinue} onClick={() => void handleContinue()}>
            {saveStatus === 'saving' ? 'Сохранение…' : 'Далее'}
          </Button>
          <OnboardingStepper current={1} total={3} />
        </>
      }
    >
      {loadStatus === 'loading' ? (
        <p className={styles.stateMessage}>Загружаем лиги…</p>
      ) : null}

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
          <SearchField value={search} onChange={setSearch} placeholder="Поиск лиги или страны" />

          {isListEmpty ? (
            <p className={styles.empty}>Ничего не найдено. Попробуй другой запрос.</p>
          ) : (
            <>
              {filteredActive.length > 0 ? (
                <section>
                  <h2 className={styles.sectionLabel}>
                    <span className={styles.sectionBar} />
                    Активные лиги
                  </h2>
                  <ul className={styles.list}>
                    {filteredActive.map((league) => (
                      <li key={league.id}>
                        <LeagueListItem
                          league={league}
                          selected={selectedIds.includes(league.id)}
                          onToggle={toggleLeague}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {filteredInactive.length > 0 ? (
                <section className={styles.inactiveSection}>
                  <h2 className={styles.sectionLabel}>
                    <span className={styles.sectionBar} />
                    Скоро
                  </h2>
                  <p className={styles.hint}>Эти лиги появятся позже — пока выбрать нельзя</p>
                  <ul className={styles.list}>
                    {filteredInactive.map((league) => (
                      <li key={league.id}>
                        <LeagueListItem league={league} selected={false} onToggle={toggleLeague} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </>
      ) : null}
    </Screen>
  );
};
