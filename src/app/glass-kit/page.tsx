'use client';

import { useState } from 'react';
import {
  ChevronLeft, Search, Bell, BookmarkPlus, Heart, MessageSquare,
  Star, Settings, User, Home as HomeIcon, ShoppingBag, Sparkle,
  Apple, Check,
} from 'lucide-react';
import {
  Wallpaper, Glass, Solid,
  Button, IconButton,
  TextField, SearchField,
  Toggle, Slider, Stepper, Segmented,
  Badge, Chip, Avatar, Card,
  ListGroup, ListRow,
  NavBar, TabBar, TopPill,
  Sheet, Alert, Toast,
  Spinner, ProgressBar, EmptyState,
  DatePicker,
} from '@/components/glass';

export default function GlassKitShowcase() {
  const [tab, setTab] = useState('home');
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a');
  const [pill, setPill] = useState('For You');
  const [chipSel, setChipSel] = useState('For you');
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [slider, setSlider] = useState(0.62);
  const [qty, setQty] = useState(1);

  return (
    <>
      <Wallpaper />
      <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: 120 }}>
        <NavBar
          large
          title="Glass Kit"
          leading={<IconButton icon={<ChevronLeft size={20} />} />}
          trailing={
            <>
              <IconButton icon={<Search size={20} />} />
              <IconButton icon={<Bell size={20} />} />
            </>
          }
        />

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* ── Buttons ── */}
          <Section title="Buttons">
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tinted">Tinted</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </Row>
            <Row>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
            <Row>
              <Button variant="primary" icon={<Apple size={18} />}>Continue with Apple</Button>
              <IconButton icon={<Heart size={18} />} ariaLabel="Like" />
              <IconButton icon={<BookmarkPlus size={18} />} ariaLabel="Save" accent />
            </Row>
          </Section>

          {/* ── Inputs ── */}
          <Section title="Inputs">
            <TextField label="Email" placeholder="you@example.com" leading={<User size={18} />} />
            <TextField label="Search" placeholder="Type to search…" leading={<Search size={18} />} />
            <SearchField placeholder="Search products or stores" />
          </Section>

          {/* ── Controls ── */}
          <Section title="Controls">
            <Row>
              <Toggle on={toggleA} onChange={setToggleA} ariaLabel="Notifications" />
              <Toggle on={toggleB} onChange={setToggleB} ariaLabel="Liquid effects" />
              <Stepper value={qty} onChange={setQty} />
            </Row>
            <Slider value={slider} onChange={setSlider} ticks />
            <Segmented
              value={seg}
              onChange={setSeg}
              full
              options={[
                { id: 'a', label: 'Daily' },
                { id: 'b', label: 'Evening' },
                { id: 'c', label: 'Layered' },
              ]}
            />
          </Section>

          {/* ── TopPill (For You / Followed Brands) ── */}
          <Section title="Top Pill">
            <TopPill options={['For You', 'Followed Brands']} value={pill} onChange={setPill} />
          </Section>

          {/* ── Display: Badge / Chip / Avatar ── */}
          <Section title="Badges & chips">
            <Row>
              <Badge variant="accent">New</Badge>
              <Badge variant="soft">Drop · Fri</Badge>
              <Badge variant="plum">Pro</Badge>
              <Badge variant="neutral">142</Badge>
            </Row>
            <Row>
              {(['For you', 'Sleep', 'Focus', 'Movement', 'Sound'] as const).map(c => (
                <Chip key={c} selected={chipSel === c} onClick={() => setChipSel(c)}>
                  {c}
                </Chip>
              ))}
            </Row>
            <Row>
              <Avatar initials="SA" size={44} status="online" />
              <Avatar initials="JL" size={44} status="busy" />
              <Avatar initials="RS" size={44} status="away" />
              <Avatar initials="KC" size={64} />
            </Row>
          </Section>

          {/* ── Card ── */}
          <Section title="Card">
            <Card padding={20}>
              <div style={{ marginBottom: 8 }}>
                <Badge variant="soft">Featured</Badge>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.05 }}>
                An afternoon, distilled.
              </div>
              <div style={{ fontSize: 14, opacity: 0.7, marginTop: 8 }}>
                Twelve hours of recorded wind and water.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Button variant="primary" size="sm">Begin</Button>
                <Button variant="secondary" size="sm">Save for later</Button>
              </div>
            </Card>
          </Section>

          {/* ── List ── */}
          <Section title="List group">
            <ListGroup header="Account" footer="Manage your subscription, address, and saved cards.">
              <ListRow leading={<User size={20} />} title="Personal info" subtitle="Name, phone, country" />
              <ListRow leading={<Settings size={20} />} title="Preferences" subtitle="Notifications, language, theme" />
              <ListRow leading={<Bell size={20} />} title="Notifications" trailing={<Toggle defaultOn />} last />
            </ListGroup>
          </Section>

          {/* ── TabBar ── */}
          <Section title="Tab bar (floating dock)">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TabBar
                items={[
                  { id: 'home', icon: <HomeIcon size={22} />, label: 'Home' },
                  { id: 'search', icon: <Search size={22} />, label: 'Search' },
                  { id: 'bag', icon: <ShoppingBag size={22} />, label: 'Bag' },
                  { id: 'account', icon: <User size={22} />, label: 'Account' },
                ]}
                active={tab}
                onChange={setTab}
              />
            </div>
          </Section>

          {/* ── Sheet ── */}
          <Section title="Sheet">
            <Sheet title="Choose a delivery method">
              <ListGroup>
                <ListRow leading={<HomeIcon size={20} />} title="Postal address" subtitle="Delivered to your door" />
                <ListRow leading={<ShoppingBag size={20} />} title="Pickup point" subtitle="Pick up nearby" last />
              </ListGroup>
              <div style={{ marginTop: 16 }}>
                <Button variant="primary" full>Continue</Button>
              </div>
            </Sheet>
          </Section>

          {/* ── Alert ── */}
          <Section title="Alert">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Alert
                title="Sign out?"
                message="You'll need to sign in again to access your saved items and orders."
                primary="Sign out"
                secondary="Cancel"
                destructive
              />
            </div>
          </Section>

          {/* ── Toast ── */}
          <Section title="Toast">
            <Toast
              icon={<Sparkle size={18} />}
              title="Order placed"
              message="We'll send updates as your order moves."
              action="View"
            />
            <Toast
              icon={<Heart size={18} />}
              title="Saved to favorites"
              message="Find it in Saved → Items."
              action="Undo"
            />
          </Section>

          {/* ── Feedback ── */}
          <Section title="Feedback">
            <Row>
              <Spinner />
              <Spinner size={32} />
              <Spinner size={48} />
            </Row>
            <ProgressBar value={0.42} />
            <ProgressBar value={0.78} />
            <EmptyState
              title="No saved items yet"
              message="Tap the heart on any product to save it here."
              action={<Button variant="primary" icon={<Sparkle size={16} />}>Browse Catalog</Button>}
            />
          </Section>

          {/* ── DatePicker ── */}
          <Section title="Date picker">
            <DatePicker />
          </Section>

          {/* ── Color tokens ── */}
          <Section title="Color tokens">
            <Row>
              <Token color="#BF066A" name="Hero" />
              <Token color="#5C0A3D" name="Plum" />
              <Token color="#ED93B1" name="Soft" />
              <Token color="#FBE0E8" name="Blush" />
              <Token color="#FFF4ED" name="Cream" />
              <Token color="#2C2C2A" name="Ink" />
            </Row>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: 'rgba(44,44,42,0.5)',
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>{children}</div>;
}

function Token({ color, name }: { color: string; name: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: color,
          boxShadow: '0 4px 14px rgba(92,10,61,0.10), inset 0 0.5px 0 rgba(255,255,255,0.3)',
        }}
      />
      <div style={{ fontSize: 12, fontWeight: 600, color: '#2C2C2A' }}>{name}</div>
      <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(44,44,42,0.55)' }}>{color}</div>
    </div>
  );
}
