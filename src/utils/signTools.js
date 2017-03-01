const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B',
        'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// 生成八位configID
const generateConfigID = () => {
  let res = '';
  for (let i = 0; i < 8; i += 1) {
    const id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
};

export { generateConfigID };
