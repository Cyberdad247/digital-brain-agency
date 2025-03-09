import * as React from 'react';

type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'ethernet' | 'wifi' | 'unknown';
type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

interface NetworkInformation extends EventTarget {
  readonly downlink: number;
  readonly effectiveType: EffectiveConnectionType;
  readonly rtt: number;
  readonly saveData: boolean;
  onchange: EventListener;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export function useSpeedAnalysis() {
  const [connectionType, setConnectionType] = React.useState<ConnectionType>('unknown');
  const [downlinkSpeed, setDownlinkSpeed] = React.useState<number>(0);
  const [rtt, setRtt] = React.useState<number>(0);

  React.useEffect(() => {
    const navigatorWithConnection = navigator as NavigatorWithConnection;

    if (!navigatorWithConnection.connection) {
      console.warn('Network Information API not supported');
      return;
    }

    const updateNetworkInfo = () => {
      const connection = navigatorWithConnection.connection!;
      setConnectionType(connection.effectiveType as ConnectionType);
      setDownlinkSpeed(connection.downlink);
      setRtt(connection.rtt);
    };

    updateNetworkInfo();
    navigatorWithConnection.connection?.addEventListener('change', updateNetworkInfo);

    return () => {
      navigatorWithConnection.connection?.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return {
    connectionType,
    downlinkSpeed,
    rtt,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g',
    isFastConnection:
      connectionType === '4g' || connectionType === '5g' || connectionType === 'ethernet',
  };
}
