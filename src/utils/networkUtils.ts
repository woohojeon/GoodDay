// 네트워크 IP 주소를 가져오는 유틸리티
export const getNetworkUrl = async (): Promise<string> => {
  try {
    // WebRTC를 사용해서 로컬 네트워크 IP 주소 가져오기
    const rtc = new RTCPeerConnection({ iceServers: [] });
    const localIp = new Promise<string>((resolve) => {
      rtc.onicecandidate = (event) => {
        if (event.candidate) {
          const ip = event.candidate.candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
          if (ip && ip[0] && !ip[0].startsWith('127.')) {
            resolve(ip[0]);
            rtc.close();
          }
        }
      };
    });

    rtc.createDataChannel('');
    const offer = await rtc.createOffer();
    await rtc.setLocalDescription(offer);

    // 타임아웃 설정 (3초)
    const timeout = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
    });

    try {
      const ip = await Promise.race([localIp, timeout]);
      const port = window.location.port || '5173';
      return `http://${ip}:${port}`;
    } catch {
      // WebRTC 실패 시 fallback
      return getFallbackUrl();
    }
  } catch {
    return getFallbackUrl();
  }
};

const getFallbackUrl = (): string => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // localhost인 경우 일반적인 네트워크 IP 대역 사용
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const baseIp = '192.168.0.4'; // Vite에서 표시된 실제 IP
    return `http://${baseIp}:${port || '5173'}`;
  }
  
  return window.location.origin;
};