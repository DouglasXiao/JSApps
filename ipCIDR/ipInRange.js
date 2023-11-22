function ipToLong(ip) {
        return ip.split('.').map((octet) => parseInt(octet, 10)).reduce((acc, octet) => (acc << 8) + octet) >>> 0;
}

function getSubnetMask(bits) {
        return (-1 << (32-bits)) >>> 0;
}

function isIpInRange(ip, cidr) {
        const [cidrIp, bits] = cidr.split("/");
        if (bits === "0") {
                return false;
        }
        const ipLong = ipToLong(ip);
        const cidrIpLong = ipToLong(cidrIp);
        const mask = getSubnetMask(parseInt(bits, 10));

        // console.log(ipLong);
        // console.log(cidrIpLong);
        // console.log(mask);

        return (ipLong & mask) === (cidrIpLong & mask);
}

console.log(isIpInRange("192.168.100.1", "192.168.100.0/31"));
console.log(isIpInRange("8.8.8.8", "8.8.8.8/0"));
console.log(isIpInRange("9.8.8.8", "8.8.8.8/7"));
