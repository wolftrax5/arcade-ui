import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArcadeButton } from '../components/Button/Button';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { ThemeProvider } from './ThemeProvider';
import { __resetSoundForTests, playCue } from './sound';

type OscMock = {
  type: OscillatorType;
  frequency: { setValueAtTime: ReturnType<typeof vi.fn> };
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
};
type GainMock = {
  gain: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    linearRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
};
type AudioMock = {
  state: 'running' | 'suspended';
  currentTime: number;
  destination: object;
  resume: ReturnType<typeof vi.fn>;
  createOscillator: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
};

let createdOscillators: OscMock[];
let audioInstances: AudioMock[];

function installAudioMock() {
  createdOscillators = [];
  audioInstances = [];
  const Ctor = vi.fn(function AudioContextMock(this: AudioMock) {
    const instance: AudioMock = {
      state: 'running',
      currentTime: 0,
      destination: {},
      resume: vi.fn(() => Promise.resolve()),
      createOscillator: vi.fn(() => {
        const osc: OscMock = {
          type: 'square',
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn().mockReturnThis(),
          start: vi.fn(),
          stop: vi.fn(),
        };
        createdOscillators.push(osc);
        return osc;
      }),
      createGain: vi.fn(() => {
        const gain: GainMock = {
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn().mockReturnThis(),
        };
        return gain;
      }),
    };
    audioInstances.push(instance);
    return instance;
  }) as unknown as typeof AudioContext;

  (window as unknown as { AudioContext: typeof AudioContext }).AudioContext = Ctor;
}

function removeAudio() {
  delete (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext;
  delete (window as unknown as { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext;
}

describe('sound gate', () => {
  beforeEach(() => {
    __resetSoundForTests();
    installAudioMock();
  });

  afterEach(() => {
    __resetSoundForTests();
    removeAudio();
    vi.restoreAllMocks();
  });

  it('plays a cue when AudioContext is available', () => {
    playCue('press');
    expect(createdOscillators).toHaveLength(1);
  });

  it('does not play when the provider mutes sound', () => {
    const { container } = render(
      <ThemeProvider defaultSound={false}>
        <ArcadeButton>Press</ArcadeButton>
      </ThemeProvider>,
    );
    act(() => {
      container.querySelector('button')!.click();
    });
    expect(createdOscillators).toHaveLength(0);
  });

  it('does not play when the instance opts out', () => {
    const { container } = render(
      <ThemeProvider>
        <ArcadeButton sound={false}>Press</ArcadeButton>
      </ThemeProvider>,
    );
    act(() => {
      container.querySelector('button')!.click();
    });
    expect(createdOscillators).toHaveLength(0);
  });

  it('does not play when prefers-reduced-motion matches', () => {
    const original = window.matchMedia;
    const matchMediaMock = vi.fn(
      () =>
        ({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(() => true),
        }) as unknown as MediaQueryList,
    );
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: matchMediaMock,
    });
    try {
      const { container } = render(
        <ThemeProvider>
          <ArcadeButton>Press</ArcadeButton>
        </ThemeProvider>,
      );
      act(() => {
        container.querySelector('button')!.click();
      });
      expect(createdOscillators).toHaveLength(0);
    } finally {
      if (original) {
        Object.defineProperty(window, 'matchMedia', {
          configurable: true,
          writable: true,
          value: original,
        });
      } else {
        delete (window as unknown as { matchMedia?: typeof window.matchMedia })
          .matchMedia;
      }
    }
  });

  it('still fires onChange when audio is unavailable', () => {
    removeAudio();
    __resetSoundForTests();
    const onChange = vi.fn();
    const { container } = render(
      <ThemeProvider>
        <Checkbox label="Enable" onChange={onChange} />
      </ThemeProvider>,
    );
    act(() => {
      container.querySelector('input')!.click();
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
