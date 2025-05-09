function calculateSubnet() {
    const ip = document.getElementById('ip').value.trim();
    const cidr = document.getElementById('cidr').value.trim();
    const resultDiv = document.getElementById('result');

    // Validate input
    if (!ip || !cidr) {
      resultDiv.innerHTML = "<p style='color: #ff6b6b;'>Please enter both IP and CIDR.</p>";
      return;
    }

    // Split IP into octets
    const octets = ip.split('.').map(Number);
    if (octets.length !== 4 || octets.some(isNaN)) {
      resultDiv.innerHTML = "<p style='color: #ff6b6b;'>Invalid IP address.</p>";
      return;
    }

    // Validate CIDR
    const cidrNumber = parseInt(cidr, 10);
    if (isNaN(cidrNumber) || cidrNumber < 0 || cidrNumber > 32) {
      resultDiv.innerHTML = "<p style='color: #ff6b6b;'>Invalid CIDR.</p>";
      return;
    }

    // Calculate subnet details
    const subnetMask = getSubnetMask(cidrNumber);
    const networkAddress = getNetworkAddress(octets, cidrNumber);
    const broadcastAddress = getBroadcastAddress(networkAddress, cidrNumber);
    const rangeStart = getRangeStart(networkAddress);
    const rangeEnd = getRangeEnd(broadcastAddress);
    const blockSize = Math.pow(2, 32 - cidrNumber);
    const numHosts = blockSize - 2;
    const numSubnets = Math.pow(2, cidrNumber - 24); // For Class C

    // Display results
    resultDiv.innerHTML = `
      <p><strong>Subnet Mask:</strong> ${subnetMask}</p>
      <p><strong>Network Address:</strong> ${networkAddress.join('.')}</p>
      <p><strong>Broadcast Address:</strong> ${broadcastAddress.join('.')}</p>
      <p><strong>Range:</strong> ${rangeStart.join('.')} - ${rangeEnd.join('.')}</p>
      <p><strong>Block Size:</strong> ${blockSize}</p>
      <p><strong>Number of Hosts:</strong> ${numHosts}</p>
      <p><strong>Number of Subnets:</strong> ${numSubnets}</p>
    `;
  }

  function getSubnetMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
      const bits = Math.min(8, Math.max(0, cidr - i * 8));
      mask.push(256 - Math.pow(2, 8 - bits));
    }
    return mask.join('.');
  }

  function getNetworkAddress(octets, cidr) {
    const network = [];
    for (let i = 0; i < 4; i++) {
      const bits = Math.min(8, Math.max(0, cidr - i * 8));
      const mask = bits === 8 ? 255 : 256 - Math.pow(2, 8 - bits);
      network.push(octets[i] & mask);
    }
    return network;
  }

  function getBroadcastAddress(network, cidr) {
    const broadcast = [...network];
    const hostBits = 32 - cidr;
    const lastOctetIndex = Math.floor(cidr / 8);
    broadcast[lastOctetIndex] += Math.pow(2, 8 - (cidr % 8)) - 1;
    for (let i = lastOctetIndex + 1; i < 4; i++) {
      broadcast[i] = 255;
    }
    return broadcast;
  }

  function getRangeStart(network) {
    const rangeStart = [...network];
    rangeStart[3] += 1;
    return rangeStart;
  }

  function getRangeEnd(broadcast) {
    const rangeEnd = [...broadcast];
    rangeEnd[3] -= 1;
    return rangeEnd;
  }