import { WalletType } from 'providers/WalletContext';
import { Wallet } from './interface';
import { Nautilus } from './nautilus';
import { Yoroi } from './yoroi';

export const getWalletByType = (walletType: WalletType.NAUTILUS | WalletType.YOROI): Wallet =>
    ({ [WalletType.NAUTILUS]: Nautilus, [WalletType.YOROI]: Yoroi }[walletType]);

export const wallets = { Nautilus, Yoroi };

export default { Nautilus, Yoroi };
