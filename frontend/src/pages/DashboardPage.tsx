// frontend/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useStatComparison } from '../hooks/useStatComparison';
import FiltersSidebar from '../components/FiltersSidebar';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import StatComparisonChart from '../components/StatComparisonChart';
import Loadout, { GearItem, TalentIcon } from '../components/Loadout';
import GearChart from '../components/GearChart';
import { getGearAverages, GearAverageResponse } from '../api/gearAverage';
import { getArchonStats, ArchonStat } from '../api/archon';
import { getTalents, TalentsResponse } from '../api/talents';
import { getIcyVeinsWeights, IcyVeinsWeight } from '../api/icyveins';

export default function DashboardPage() {
  // Allow switching between raids and mythic dungeons and play styles (single vs AOE)
  const [contentType, setContentType] = useState<'raids' | 'mythic-dungeons'>('raids');
  const [buildType, setBuildType] = useState<'single-target' | 'aoe'>('single-target');
  // Derive spec slug for API calls: e.g. 'druid-balance-raids-single-target'
  const specBase = 'druid-balance';
  const specSlug = `${specBase}-${contentType}-${buildType}`;
  const { realm, character } = useStore();
  // Loading and error states for gear and Archon data
  const [gearLoading, setGearLoading] = useState(false);
  const [gearError, setGearError] = useState<string | null>(null);
  const [archonLoading, setArchonLoading] = useState(false);
  const [archonError, setArchonError] = useState<string | null>(null);
  const [talentsLoading, setTalentsLoading] = useState(false);
  const [talentsError, setTalentsError] = useState<string | null>(null);
  const [icyLoading, setIcyLoading] = useState(false);
  const [icyError, setIcyError] = useState<string | null>(null);
  // placeholder states
  const [gearData, setGearData] = useState<GearAverageResponse | null>(null);
  const [archonStats, setArchonStats] = useState<ArchonStat[]>([]);
  const [talents, setTalents] = useState<TalentsResponse | null>(null);
  const [icyWeights, setIcyWeights] = useState<IcyVeinsWeight[]>([]);

  // sidebar visibility toggle
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const { sortedByActual, loading, error } =
    useStatComparison(specSlug, realm, character);

  // Fetch gear averages based on content type
  useEffect(() => {
    if (realm && character) {
      setGearLoading(true);
      setGearError(null);
      getGearAverages(realm, character, specSlug)
        .then(data => setGearData(data))
        .catch(err => setGearError(err.message))
        .finally(() => setGearLoading(false));
    }
  }, [realm, character, specSlug]);

  // Fetch archon stats via WarcraftLogs proxy
  useEffect(() => {
    if (realm && character) {
      setArchonLoading(true);
      setArchonError(null);
      getArchonStats(realm, character, specSlug)
        .then(stats => setArchonStats(stats))
        .catch(err => setArchonError(err.message))
        .finally(() => setArchonLoading(false));
    }
  }, [realm, character, specSlug]);
  
  // Fetch talents
  useEffect(() => {
    if (realm && character) {
      // Clear and fetch talents
      setTalents(null);
      setTalentsLoading(true);
      setTalentsError(null);
      getTalents(realm, character, specSlug)
        .then(data => setTalents(data))
        .catch(err => setTalentsError(err.message))
        .finally(() => setTalentsLoading(false));
    }
  }, [realm, character, specSlug]);

  // Fetch Icy Veins stat weights for current spec
  useEffect(() => {
    setIcyLoading(true);
    setIcyError(null);
    getIcyVeinsWeights(specSlug)
      .then(weights => setIcyWeights(weights))
      .catch(err => setIcyError(err.message))
      .finally(() => setIcyLoading(false));
  }, [specSlug]);

  // Placeholder gear array for template display
  const placeholderGear: GearItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `slot-${i}`,
    iconUrl: '',
    itemLevel: 0,
  }));

  // Placeholder talents for visual template
  const placeholderTalents: TalentIcon[] = Array.from({ length: 3 }, (_, i) => ({
    id: `placeholder-class-${i}`,
    iconUrl: '',
  }));
  const placeholderHeroTalents: TalentIcon[] = Array.from({ length: 3 }, (_, i) => ({
    id: `placeholder-hero-${i}`,
    iconUrl: '',
  }));
  const placeholderSpecTalents: TalentIcon[] = Array.from({ length: 3 }, (_, i) => ({
    id: `placeholder-spec-${i}`,
    iconUrl: '',
  }));

  return (
    <div className="dashboard-container">
      {sidebarVisible && <FiltersSidebar />}
      <div className="dashboard-main">
        <Header
          onToggleSidebar={() => setSidebarVisible(v => !v)}
          isSidebarVisible={sidebarVisible}
        />
        <main style={{ flex: 1, padding: 16, overflow: 'visible' }}>
          <>
            {/* Content type and play style selectors */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div>
                <label htmlFor="contentType">Content Type: </label>
                <select id="contentType" value={contentType} onChange={e => setContentType(e.target.value as any)}>
                  <option value="raids">Raids</option>
                  <option value="mythic-dungeons">Mythic Dungeons</option>
                </select>
              </div>
              <div>
                <label htmlFor="buildType">Play Style: </label>
                <select id="buildType" value={buildType} onChange={e => setBuildType(e.target.value as any)}>
                  <option value="single-target">Single Target</option>
                  <option value="aoe">AOE</option>
                </select>
              </div>
            </div>
            <ProfileCard realm={realm} name={character} />
            {!error && (
              <StatComparisonChart
                data={sortedByActual}
                loading={loading}
              />
            )}
            {/* Gear loadout display */}
            <Loadout
              averageIlvl={gearData?.item_level_equipped ?? 0}
              setPieces={gearData?.items.length ?? 0}
              gear={gearData?.items.map(i => ({ id: i.slot, iconUrl: i.icon, itemLevel: i.item_level })) || placeholderGear}
              classTalents={talents && talents.classTalents.length > 0 ? talents.classTalents : placeholderTalents}
              heroTalents={talents && talents.heroTalents.length > 0 ? talents.heroTalents : placeholderHeroTalents}
              specTalents={talents && talents.specTalents.length > 0 ? talents.specTalents : placeholderSpecTalents}
            />
            {/* Gear averages status */}
            {gearLoading && <div>Loading gear data...</div>}
            {gearError && <div className="error">Error loading gear: {gearError}</div>}
            {/* Archon stats status */}
            {archonLoading && <div>Loading Archon stats...</div>}
            {archonError && <div className="error">Error loading Archon stats: {archonError}</div>}
            {/* Talents status */}
            {talentsLoading && <div>Loading talents...</div>}
            {talentsError && <div className="error">Error loading talents: {talentsError}</div>}
            {/* Icy Veins status */}
            {icyLoading && <div>Loading Icy Veins weights...</div>}
            {icyError && <div className="error">Error loading Icy Veins: {icyError}</div>}
             {/* Gear comparison table */}
            <GearChart
              gear={
                gearData && gearData.items.length > 0
                  ? gearData.items.map(i => ({ id: i.slot, iconUrl: i.icon, itemLevel: i.item_level }))
                  : placeholderGear
              }
              archonGear={placeholderGear}
              icyGear={placeholderGear}
              averageIlvl={gearData?.item_level_equipped ?? 0}
              setPieces={gearData?.items.length ?? placeholderGear.length}
              archonAverageIlvl={gearData?.item_level_equipped ?? 0}
              icyBestIlvl={gearData?.item_level_equipped ?? 0}
              archonStats={archonStats}
              icyWeights={icyWeights}
              classTalents={talents?.classTalents ?? placeholderTalents}
              heroTalents={talents?.heroTalents ?? placeholderHeroTalents}
              specTalents={talents?.specTalents ?? placeholderSpecTalents}
            />
            {/* Gear slot averages from Raider.IO */}
            {gearData?.averages && (
              <div>
                <h3>Community & BIS Gear Averages</h3>
                <ul>
                  {gearData.averages.map(a => (
                    <li key={a.slot}>
                      {a.slot}: community avg {a.communityAvg}, BIS {a.bis}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Icy Veins stat weights */}
            {icyWeights.length > 0 && (
              <div>
                <h3>Icy Veins Stat Weights</h3>
                <ul>
                  {icyWeights.map(w => (
                    <li key={w.stat}>
                      {w.stat}: {w.weight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>

          {/* …rest of page… */}
        </main>
      </div>
    </div>
  );
}