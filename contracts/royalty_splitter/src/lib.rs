#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short, token, Vec};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Creator,
    Platform,
    Treasury,
    Shares, // [CreatorShare, PlatformShare, TreasuryShare]
}

#[contract]
pub struct RoyaltySplitter;

#[contractimpl]
impl RoyaltySplitter {
    pub fn init(env: Env, creator: Address, platform: Address, treasury: Address, shares: Vec<u32>) {
        if shares.len() != 3 {
            panic!("shares must have 3 elements");
        }
        let total: u32 = shares.get(0).unwrap() + shares.get(1).unwrap() + shares.get(2).unwrap();
        if total != 10000 {
            panic!("total shares must be 10000");
        }

        env.storage().instance().set(&DataKey::Creator, &creator);
        env.storage().instance().set(&DataKey::Platform, &platform);
        env.storage().instance().set(&DataKey::Treasury, &treasury);
        env.storage().instance().set(&DataKey::Shares, &shares);
    }

    pub fn split(env: Env, token_address: Address, sender: Address, amount: i128) {
        let creator: Address = env.storage().instance().get(&DataKey::Creator).unwrap();
        let platform: Address = env.storage().instance().get(&DataKey::Platform).unwrap();
        let treasury: Address = env.storage().instance().get(&DataKey::Treasury).unwrap();
        let shares: Vec<u32> = env.storage().instance().get(&DataKey::Shares).unwrap();

        let client = token::Client::new(&env, &token_address);

        let creator_amt = (amount * (shares.get(0).unwrap() as i128)) / 10000;
        let platform_amt = (amount * (shares.get(1).unwrap() as i128)) / 10000;
        let treasury_amt = (amount * (shares.get(2).unwrap() as i128)) / 10000;

        if creator_amt > 0 {
            client.transfer(&sender, &creator, &creator_amt);
        }
        if platform_amt > 0 {
            client.transfer(&sender, &platform, &platform_amt);
        }
        if treasury_amt > 0 {
            client.transfer(&sender, &treasury, &treasury_amt);
        }

        env.events().publish((symbol_short!("split"), sender), amount);
    }
}
