<template>
  <div>
    <div class="modal" :class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin-top:-20vh">
        <header class="modal-card-head">
          <p class="modal-card-title">New Container</p>
          <button class="delete" aria-label="close" @click="isActive = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="console" :id="'terminal-' + fingerprint"></div>
          <div v-show="!launching && !launched">
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="name">Name</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <el-input placeholder="Enter name for new container..." v-model="name"></el-input>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Image</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <p class="control">
                    <input class="input is-static" type="text" v-model="description" readonly>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="profile">Profile</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <el-select v-model="profiles" multiple placeholder="Select container profile">
                    <el-option label="default" value="default"></el-option>
                    <el-option label="profile-nameb" value="profile-nameb"></el-option>
                  </el-select>
                </div>
              </div>
            </div>             
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="profile">Count</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <el-input-number v-model="count" controls-position="right" :min="1" :max="10"></el-input-number>
                </div>
              </div>
            </div>            
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label" for="ephemeral">Ephemeral</label>
              </div>
              <div class="field-body">
                <div class="field" style="margin-top:5px">
                  <el-switch active-color="#13ce66" v-model="ephemeral"></el-switch>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot" v-show="!launched">
          <button 
                  @click="launch()" 
                  v-bind:class="{ 'is-loading': launching }" 
                  v-bind:disabled="launching"
                  class="button is-success">Launch</button>
          <button class="button" @click="isActive = false" v-bind:disabled="launching">Cancel</button>
        </footer>
        <footer class="modal-card-foot" v-show="launched">
          <button class="button is-success" @click="close_modal()">Close</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  import { Terminal } from 'xterm'
  import * as fit from 'xterm/lib/addons/fit/fit'

  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    cwd: 'lxd-ui' // ,
    // encryptionKey: 'obfuscation'
  })

  export default {
    data () {
      return {
        isActive: false,
        description: null,
        fingerprint: null,
        remote: null,
        name: null,
        profiles: ['default'],
        count: 1,
        ephemeral: null,
        launching: false,
        launched: false,
        xterm: null
      }
    },
    methods: {
      /**
       * Fired from parent
       */
      open (value) {
        this.isActive = true
        this.remote = value.remote
        this.fingerprint = value.fingerprint
        this.description = value.description
      },
      /**
       * Used if user does not supply a name and count is > 1
       * prevents null-1 etc
       */
      random_petname () {
        var adjectives = ['able', 'above', 'absolute', 'accepted', 'accurate', 'ace', 'active', 'actual', 'adapted', 'adapting', 'adequate', 'adjusted', 'advanced', 'alert', 'alive', 'allowed', 'allowing', 'amazed', 'amazing', 'ample', 'amused', 'amusing', 'apparent', 'apt', 'arriving', 'artistic', 'assured', 'assuring', 'awaited', 'awake', 'aware', 'balanced', 'becoming', 'beloved', 'better', 'big', 'blessed', 'bold', 'boss', 'brave', 'brief', 'bright', 'bursting', 'busy', 'calm', 'capable', 'capital', 'careful', 'caring', 'casual', 'causal', 'central', 'certain', 'champion', 'charmed', 'charming', 'cheerful', 'chief', 'choice', 'civil', 'classic', 'clean', 'clear', 'clever', 'climbing', 'close', 'closing', 'coherent', 'comic', 'communal', 'complete', 'composed', 'concise', 'concrete', 'content', 'cool', 'correct', 'cosmic', 'crack', 'creative', 'credible', 'crisp', 'crucial', 'cuddly', 'cunning', 'curious', 'current', 'cute', 'daring', 'darling', 'dashing', 'dear', 'decent', 'deciding', 'deep', 'definite', 'delicate', 'desired', 'destined', 'devoted', 'direct', 'discrete', 'distinct', 'diverse', 'divine', 'dominant', 'driven', 'driving', 'dynamic', 'eager', 'easy', 'electric', 'elegant', 'emerging', 'eminent', 'enabled', 'enabling', 'endless', 'engaged', 'engaging', 'enhanced', 'enjoyed', 'enormous', 'enough', 'epic', 'equal', 'equipped', 'eternal', 'ethical', 'evident', 'evolved', 'evolving', 'exact', 'excited', 'exciting', 'exotic', 'expert', 'factual', 'fair', 'faithful', 'famous', 'fancy', 'fast', 'feasible', 'fine', 'finer', 'firm', 'first', 'fit', 'fitting', 'fleet', 'flexible', 'flowing', 'fluent', 'flying', 'fond', 'frank', 'free', 'fresh', 'full', 'fun', 'funny', 'game', 'generous', 'gentle', 'genuine', 'giving', 'glad', 'glorious', 'glowing', 'golden', 'good', 'gorgeous', 'grand', 'grateful', 'great', 'growing', 'grown', 'guided', 'guiding', 'handy', 'happy', 'hardy', 'harmless', 'healthy', 'helped', 'helpful', 'helping', 'heroic', 'hip', 'holy', 'honest', 'hopeful', 'hot', 'huge', 'humane', 'humble', 'humorous', 'ideal', 'immense', 'immortal', 'immune', 'improved', 'in', 'included', 'infinite', 'informed', 'innocent', 'inspired', 'integral', 'intense', 'intent', 'internal', 'intimate', 'inviting', 'joint', 'just', 'keen', 'key', 'kind', 'knowing', 'known', 'large', 'lasting', 'leading', 'learning', 'legal', 'legible', 'lenient', 'liberal', 'light', 'liked', 'literate', 'live', 'living', 'logical', 'loved', 'loving', 'loyal', 'lucky', 'magical', 'magnetic', 'main', 'major', 'many', 'massive', 'master', 'mature', 'maximum', 'measured', 'meet', 'merry', 'mighty', 'mint', 'model', 'modern', 'modest', 'moral', 'more', 'moved', 'moving', 'musical', 'mutual', 'national', 'native', 'natural', 'nearby', 'neat', 'needed', 'neutral', 'new', 'next', 'nice', 'noble', 'normal', 'notable', 'noted', 'novel', 'obliging', 'on', 'one', 'open', 'optimal', 'optimum', 'organic', 'oriented', 'outgoing', 'patient', 'peaceful', 'perfect', 'pet', 'picked', 'pleasant', 'pleased', 'pleasing', 'poetic', 'polished', 'polite', 'popular', 'positive', 'possible', 'powerful', 'precious', 'precise', 'premium', 'prepared', 'present', 'pretty', 'primary', 'prime', 'pro', 'probable', 'profound', 'promoted', 'prompt', 'proper', 'proud', 'proven', 'pumped', 'pure', 'quality', 'quick', 'quiet', 'rapid', 'rare', 'rational', 'ready', 'real', 'refined', 'regular', 'related', 'relative', 'relaxed', 'relaxing', 'relevant', 'relieved', 'renewed', 'renewing', 'resolved', 'rested', 'rich', 'right', 'robust', 'romantic', 'ruling', 'sacred', 'safe', 'saved', 'saving', 'secure', 'select', 'selected', 'sensible', 'set', 'settled', 'settling', 'sharing', 'sharp', 'shining', 'simple', 'sincere', 'singular', 'skilled', 'smart', 'smashing', 'smiling', 'smooth', 'social', 'solid', 'sought', 'sound', 'special', 'splendid', 'square', 'stable', 'star', 'steady', 'sterling', 'still', 'stirred', 'stirring', 'striking', 'strong', 'stunning', 'subtle', 'suitable', 'suited', 'summary', 'sunny', 'super', 'superb', 'supreme', 'sure', 'sweeping', 'sweet', 'talented', 'teaching', 'tender', 'thankful', 'thorough', 'tidy', 'tight', 'together', 'tolerant', 'top', 'topical', 'tops', 'touched', 'touching', 'tough', 'true', 'trusted', 'trusting', 'trusty', 'ultimate', 'unbiased', 'uncommon', 'unified', 'unique', 'united', 'up', 'upright', 'upward', 'usable', 'useful', 'valid', 'valued', 'vast', 'verified', 'viable', 'vital', 'vocal', 'wanted', 'warm', 'wealthy', 'welcome', 'welcomed', 'well', 'whole', 'willing', 'winning', 'wired', 'wise', 'witty', 'wondrous', 'workable', 'working', 'worthy']

        var names = ['ox', 'ant', 'ape', 'asp', 'bat', 'bee', 'boa', 'bug', 'cat', 'cod', 'cow', 'cub', 'doe', 'dog', 'eel', 'eft', 'elf', 'elk', 'emu', 'ewe', 'fly', 'fox', 'gar', 'gnu', 'hen', 'hog', 'imp', 'jay', 'kid', 'kit', 'koi', 'lab', 'man', 'owl', 'pig', 'pug', 'pup', 'ram', 'rat', 'ray', 'yak', 'bass', 'bear', 'bird', 'boar', 'buck', 'bull', 'calf', 'chow', 'clam', 'colt', 'crab', 'crow', 'dane', 'deer', 'dodo', 'dory', 'dove', 'drum', 'duck', 'fawn', 'fish', 'flea', 'foal', 'fowl', 'frog', 'gnat', 'goat', 'grub', 'gull', 'hare', 'hawk', 'ibex', 'joey', 'kite', 'kiwi', 'lamb', 'lark', 'lion', 'loon', 'lynx', 'mako', 'mink', 'mite', 'mole', 'moth', 'mule', 'mutt', 'newt', 'orca', 'oryx', 'pika', 'pony', 'puma', 'seal', 'shad', 'slug', 'sole', 'stag', 'stud', 'swan', 'tahr', 'teal', 'tick', 'toad', 'tuna', 'wasp', 'wolf', 'worm', 'wren', 'yeti', 'adder', 'akita', 'alien', 'aphid', 'bison', 'boxer', 'bream', 'bunny', 'burro', 'camel', 'chimp', 'civet', 'cobra', 'coral', 'corgi', 'crane', 'dingo', 'drake', 'eagle', 'egret', 'filly', 'finch', 'gator', 'gecko', 'ghost', 'ghoul', 'goose', 'guppy', 'heron', 'hippo', 'horse', 'hound', 'husky', 'hyena', 'koala', 'krill', 'leech', 'lemur', 'liger', 'llama', 'louse', 'macaw', 'midge', 'molly', 'moose', 'moray', 'mouse', 'panda', 'perch', 'prawn', 'quail', 'racer', 'raven', 'rhino', 'robin', 'satyr', 'shark', 'sheep', 'shrew', 'skink', 'skunk', 'sloth', 'snail', 'snake', 'snipe', 'squid', 'stork', 'swift', 'swine', 'tapir', 'tetra', 'tiger', 'troll', 'trout', 'viper', 'wahoo', 'whale', 'zebra', 'alpaca', 'amoeba', 'baboon', 'badger', 'beagle', 'bedbug', 'beetle', 'bengal', 'bobcat', 'caiman', 'cattle', 'cicada', 'collie', 'condor', 'cougar', 'coyote', 'dassie', 'donkey', 'dragon', 'earwig', 'falcon', 'feline', 'ferret', 'gannet', 'gibbon', 'glider', 'goblin', 'gopher', 'grouse', 'guinea', 'hermit', 'hornet', 'iguana', 'impala', 'insect', 'jackal', 'jaguar', 'jennet', 'kitten', 'kodiak', 'lizard', 'locust', 'maggot', 'magpie', 'mammal', 'mantis', 'marlin', 'marmot', 'marten', 'martin', 'mayfly', 'minnow', 'monkey', 'mullet', 'muskox', 'ocelot', 'oriole', 'osprey', 'oyster', 'parrot', 'pigeon', 'piglet', 'poodle', 'possum', 'python', 'quagga', 'rabbit', 'raptor', 'rodent', 'roughy', 'salmon', 'sawfly', 'serval', 'shiner', 'shrimp', 'spider', 'sponge', 'tarpon', 'thrush', 'tomcat', 'toucan', 'turkey', 'turtle', 'urchin', 'vervet', 'walrus', 'weasel', 'weevil', 'wombat', 'anchovy', 'anemone', 'bluejay', 'buffalo', 'bulldog', 'buzzard', 'caribou', 'catfish', 'chamois', 'cheetah', 'chicken', 'chigger', 'cowbird', 'crawdad', 'cricket', 'dogfish', 'dolphin', 'firefly', 'garfish', 'gazelle', 'gelding', 'giraffe', 'gobbler', 'gorilla', 'goshawk', 'grackle', 'griffon', 'grizzly', 'grouper', 'gryphon', 'haddock', 'hagfish', 'halibut', 'hamster', 'herring', 'jackass', 'javelin', 'jawfish', 'jaybird', 'katydid', 'ladybug', 'lamprey', 'lemming', 'leopard', 'lioness', 'lobster', 'macaque', 'mallard', 'mammoth', 'manatee', 'mastiff', 'meerkat', 'mollusk', 'monarch', 'mongrel', 'monitor', 'monster', 'mudfish', 'muskrat', 'mustang', 'narwhal', 'oarfish', 'octopus', 'opossum', 'ostrich', 'panther', 'peacock', 'pegasus', 'pelican', 'penguin', 'phoenix', 'piranha', 'polecat', 'primate', 'quetzal', 'raccoon', 'rattler', 'redbird', 'redfish', 'reptile', 'rooster', 'sawfish', 'sculpin', 'seagull', 'skylark', 'snapper', 'spaniel', 'sparrow', 'sunbeam', 'sunbird', 'sunfish', 'tadpole', 'termite', 'terrier', 'unicorn', 'vulture', 'wallaby', 'walleye', 'warthog', 'whippet', 'wildcat', 'aardvark', 'airedale', 'albacore', 'anteater', 'antelope', 'arachnid', 'barnacle', 'basilisk', 'blowfish', 'bluebird', 'bluegill', 'bonefish', 'bullfrog', 'cardinal', 'chipmunk', 'cockatoo', 'crawfish', 'crayfish', 'dinosaur', 'doberman', 'duckling', 'elephant', 'escargot', 'flamingo', 'flounder', 'foxhound', 'glowworm', 'goldfish', 'grubworm', 'hedgehog', 'honeybee', 'hookworm', 'humpback', 'kangaroo', 'killdeer', 'kingfish', 'labrador', 'lacewing', 'ladybird', 'lionfish', 'longhorn', 'mackerel', 'malamute', 'marmoset', 'mastodon', 'moccasin', 'mongoose', 'monkfish', 'mosquito', 'pangolin', 'parakeet', 'pheasant', 'pipefish', 'platypus', 'polliwog', 'porpoise', 'reindeer', 'ringtail', 'sailfish', 'scorpion', 'seahorse', 'seasnail', 'sheepdog', 'shepherd', 'silkworm', 'squirrel', 'stallion', 'starfish', 'starling', 'stingray', 'stinkbug', 'sturgeon', 'terrapin', 'titmouse', 'tortoise', 'treefrog', 'werewolf', 'woodcock']
        return _.sample(adjectives) + '-' + _.sample(names)
      },
      /**
       *
       */
      launch () {
        this.launching = true

        //
        Terminal.applyAddon(fit)
        this.xterm = new Terminal({
          useStyle: false,
          screenKeys: false,
          cursorBlink: true
        })

        //
        this.xterm.open(document.getElementById('terminal-' + this.fingerprint))
        this.xterm.resize(0, 15)
        this.xterm.fit()

        //
        const { spawn } = require('child_process')

        //
        let ls = []
        for (var i = 1; i <= this.count; i++) {
          let spawnProps = []
          spawnProps.push(this.remote + ':' + this.fingerprint)
          if (this.count === 1) {
            spawnProps.push(this.name)
          } else {
            console.log(this.name)
            if (this.count > 1 && (this.name === '' || this.name === null)) {
              this.name = this.random_petname()
            }
            spawnProps.push(this.name + '-' + i)
          }
          spawnProps.push('-p ' + this.profiles.join(' -p '))
          spawnProps.push((this.ephemeral ? '-e' : ''))

          ls[i] = spawn('lxc launch', spawnProps, {
            shell: true
          })

          ls[i].stdout.on('data', (data) => {
            let line = data.toString().trim()
            if (line !== '') {
              this.xterm.writeln(line)
            }
          })

          ls[i].stderr.on('data', (data) => {
            let line = data.toString().trim()
            if (line !== '') {
              this.xterm.writeln(line)
            }
          })

          ls[i].on('close', (code) => {
            if (code === 0) {
              this.$notify({
                duration: 2000,
                title: 'Success',
                message: 'Container successfully created.',
                type: 'success'
              })
              this.launching = false
              this.launched = true
            }
          })
        }

        storage.set('images_cached.local', 0)
      },
      /**
       *
       */
      close_modal () {
        this.xterm.destroy()
        this.remote = null
        this.fingerprint = null
        this.launching = false
        this.launched = false
        this.isActive = false
      }
    }
  }
</script>

<style scoped>

  /* for some odd reason, 
     the above modal title Container word gets selected upon submit, this is to prevent that :/ 
  */
  .modal-card-title {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .console {
    overflow: hidden;
    width: 100%;
    height: 100%!important;
  }

</style>
